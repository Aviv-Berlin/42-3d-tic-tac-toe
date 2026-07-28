import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

// Store connected clients
const clients = new Set<Response>();

interface Match {
	host: string;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started";
}

const matches = new Map<string, Match>();


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

	if (matches.has(body.host)) {
		return response.status(400).json({
			error: "You already have a hosted match"
		});
	}

	const newMatch: Match = {
		host: body.host,
		size: body.size,
		requiredPlayers: body.requiredPlayers,
		players: [body.host],
		status: "waiting"
	}
	matches.set(body.host, newMatch);

	// Broadcast the new match to all clients in the lobby
	broadcast('new-match', newMatch);

	return response.status(201).json({
		message: 'match created',
		match: newMatch
	});
}

export async function joinMatch(request: Request, response: Response) {
	const body = request.body;

export default {
	lobby
};