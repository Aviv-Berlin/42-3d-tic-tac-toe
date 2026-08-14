//import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import { broadcastMatch } from "../websocket/matchSockets.ts";
import { GameState } from '../game/GameState.ts';
//import jwt from 'jsonwebtoken';

import { GameMode, AiLevel } from '../../../shared/game.ts';
//import { initGame } from "../websocket/matchSockets.ts"
//import { PlayerConnection } from '../websocket/matchSockets.ts';
// Store connected clients
const clients = new Set<Response>();

export interface Match {
	id: string;
	host: string;
	mode: GameMode;
	level: AiLevel;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started" | "disconnected" | "canceled";
	state: GameState | null;
}

export const lobbyMatches = new Map<string, Match>();

export const matches = new Map<string, Match>();


// SSE endpoint function
export async function lobby(request: Request, response: Response){
	// Set headers for SSE
	response.writeHead(200, {
	'Content-Type': 'text/event-stream',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive',
	});

	console.log('current matches:', Array.from(lobbyMatches.values()));

	// Send initial comment to establish the connection
	// Comments start with a colon and are ignored by EventSource / clients
	response.write(': Connected to lobby\n\n');

	// Add this client to the set
	clients.add(response);

	sendEvent(response, 'lobby-update', {
		type: "initial",
		matches: Array.from(lobbyMatches.values())
	})

	console.log(`Client connected. Total clients: ${clients.size}`);

	// Handle client disconnect
	request.on('close', () => {
		clients.delete(response);
		console.log(`Client disconnected. Total clients: ${clients.size}`);
	});
}

// Helper fucntion to send an event to a specific client
export function sendEvent(response: Response, event: string, data: unknown, id: string | null = null) {
	let message = "";
	if (id) message += `id: ${id}\n`;
	if (event) message += `event: ${event}\n`;
	message += `data: ${JSON.stringify(data)}\n\n`;

	response.write(message);
}

// Broadcast an event to all connected clients
export function broadcast(event: string, data: unknown) {
	const id = Date.now().toString();

	clients.forEach((client) => {
		sendEvent(client, event, data, id);
	});
}

export async function createMatch(request: Request, response: Response) {
	const body = request.body;

	if (!body.size || !body.requiredPlayers) {
		return response.status(400).json({
			error: 'match data incomplete'
		});
	}

	console.log('Creating match as host:', body.host);

	const existingMatch = Array.from(lobbyMatches.values()).find(match => match.host === body.host);
	if (existingMatch) {
		console.log(`Host ${body.host} already has a match.`);
		return response.status(400).json({
			error: "You already have a hosted match"
		});
	}

	const matchId = crypto.randomUUID(); // Generate a unique match ID
	const newMatch: Match = {
		id: matchId,
		host: body.host,
		mode: "online",
		level: 0,
		size: body.size,
		requiredPlayers: body.requiredPlayers,
		players: [body.host],
		status: "waiting",
		state: null
	}
	lobbyMatches.set(matchId, newMatch);
	matches.set(matchId, newMatch);

	// Broadcast the new match to all clients in the lobby
	broadcast('lobby-update', {type: "created", match: newMatch});

	return response.status(201).json({
		message: 'match created',
		match: newMatch
	});
}

export async function joinMatch(request: Request, response: Response) {

	const body = request.body;
	const match = lobbyMatches.get(body.matchId);

	console.log(`Player ${body.player} is trying to join match ${body.matchId}`);
	console.log('found match:', match);

	if (!match) {
		return response.status(404).json({
			error: 'match not found'
		});
	}

	if (match.players.includes(body.player)) {
		return response.status(400).json({
			error: 'player already in match'
		});
	}

	if (match.status !== "waiting") {
		return response.status(400).json({
			error: 'match is not open for joining'
		});
	}

	if (match.players.length === match.requiredPlayers) {
		return response.status(400).json({
			error: 'match is full'
		});
	}

	// Add player to the match
	match.players.push(body.player);
	console.log('added player to match:', match);
	broadcastMatch(match.id, {
		type: "match-state",
		host: match.host,
		mode: match.mode,
		level: match.level,
		size: match.size,
		requiredPlayers: match.requiredPlayers,
		players: match.players,
		status: match.status
	});

	// Update match status if required players reached
	if (match.players.length === match.requiredPlayers) {
		match.status = "ready";
		broadcast('lobby-update', {
			type: "removed",
			match: match
		});
		lobbyMatches.delete(match.id);
		console.log('match is ready, removed from lobby:');
	}
	else {
		broadcast('lobby-update', {
			type: "updated",
			match: match
		});
	}
	return response.status(200).json({
		message: 'joined match',
		match: match
	});
}

// export async function createGame(request: Request, response: Response){
// 	const body = request.body;

// 	if (!body.size || !body.username || !body.gameMode || !body.level) {
// 		return response.status(400).json({
// 			error: 'match settings incomplete'
// 		});
// 	}

// 	console.log('Creating local/ai match:', body.host);

// 	 // Generate a unique match ID
// 	const newMatch: Match = {
// 		id: body.matchId,
// 		host: body.username,
// 		mode: body.gameMode,
// 		level: body.level,
// 		size: body.size,
// 		requiredPlayers: 2,
// 		players: [body.host],
// 		status: "ready",
// 		state: null
// 	}

// 	const players = new Set<PlayerConnection>();
// 	players.add({
// 		username: newMatch.host,
// 		ws: body.socket
// 	})
// 	const gameData = initGame(newMatch, players);

// 	return response.status(201).json({
// 		message: 'match created',
// 		gameData: gameData
// 	});
// }


export default {
	lobby,
	createMatch,
	joinMatch,
	//createGame
};

// generate a real match ID with crypto.randomUUID() or similar, instead of using host as the match ID. This will allow multiple matches to be hosted by the same user and avoid potential conflicts. (?)
// store player identity properly instead of localStorage.getItem("username") in the frontend, and validate it on the backend with authentication/JWT
// create the WebSocket server. Seperate from lobby routes e.g. ws://localhost:3001/game/:matchID


// check how to transform from http to websocket connection!!!!
// once player created a match or joined one, fronted need to navigate them to game room and open websocket connection to the game room, and then the game room will handle the game logic and send updates to the players in the room.
