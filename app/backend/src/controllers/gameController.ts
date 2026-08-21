//import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import { broadcastMatch } from "../websocket/matchSockets.ts";
import { GameState } from '../game/GameState.ts';

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

	// Send initial comment to establish the connection
	// Comments start with a colon and are ignored by EventSource / clients
	response.write(': Connected to lobby\n\n');

	// Add this client to the set
	clients.add(response);
	console.log(`[LOBBY] client connected (current matches: ${lobbyMatches.size} / total clients: ${clients.size})`);

	sendEvent(response, 'lobby-update', {
		type: "initial",
		matches: Array.from(lobbyMatches.values())
	})

	// Handle client disconnect
	request.on('close', () => {
		clients.delete(response);
		console.log(`[LOBBY] client disconnected (current matches: ${lobbyMatches.size} / total clients: ${clients.size})`);
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

	const existingMatch = Array.from(lobbyMatches.values()).find(match => match.host === body.host);
	if (existingMatch) {
		console.log(`[createMatch] Host ${body.host} already has a match.`);
		return response.status(400).json({
			error: "You already have a hosted match"
		});
	}
	console.log('[createMatch] match created by host:', body.host);

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

	//console.log(`[LOBBY] Player ${body.player} requests to join match ${body.matchId} (host: ${match?.host})`);

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
	console.log(`[joinMatch] Player ${body.player} joined match ${body.matchId} (host: ${match?.host})`);
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
		console.log('[joinMatch] match is full - removed from lobby');
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


export default {
	lobby,
	createMatch,
	joinMatch,
};
