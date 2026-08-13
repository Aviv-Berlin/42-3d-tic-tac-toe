import { WebSocketServer, WebSocket} from "ws";
import type http from "http";
import { broadcastMatch, matchSockets } from "../websocket/matchSockets.ts";
import { lobbyMatches, matches, broadcast } from "../controllers/gameController.ts";
import { GameState } from "../game/GameState.ts";

import { handleMessage } from "../game/socketHandlersBE.ts";
import { WsMessage } from "../../../shared/messages.ts"

export function setupWebSocket(server: http.Server) {

	const wss = new WebSocketServer({ server });
	const aliveSockets = new Map<WebSocket, boolean>(); //<socket, isAlive?>

	wss.on("connection", (socket: WebSocket, request: http.IncomingMessage) => {

		aliveSockets.set(socket, true);

		const url = new URL(request.url ?? "", "http://localhost");

		const matchId = url.pathname.split("/").pop();
		const username = url.searchParams.get("username");

		if (!matchId || !username) {
			console.log("No match ID provided");
			socket.close();
			return;
		}

		const match = matches.get(matchId);
		if (!match) {
			console.log(`Match not found: ${matchId}`);
			socket.send(JSON.stringify({ type: "error", message: "Match not found" }));
			socket.close();
			return;
		}

		if (!matchSockets.has(matchId)) {
			matchSockets.set(matchId, new Set());
		}

		matchSockets.get(matchId)?.add({
			username: username,
			ws: socket
		});

		// Send the current match state to the newly connected client
		socket.send(JSON.stringify({
			type: "match-state",
			host: match.host,
			size: match.size,
			requiredPlayers: match.requiredPlayers,
			players: match.players,
			status: match.status
		 }));

		 // use later for broadcasting messages to all clients in the match
		 socket.on("message", (event) => {
			console.log("Server received message");
			console.log(`No. of matches: ${matches.size}`);
			const message: WsMessage = JSON.parse(event.toString());
			//handleMessage(message, socket,	match, games)
			handleMessage(message, socket, match);
		});

		socket.on("pong", () => {
			aliveSockets.set(socket, true);
		})

		socket.on("close", () => {
			aliveSockets.delete(socket);

			const sockets = matchSockets.get(matchId);
			if (!sockets) return;
			const disconnectedPlayer = [...sockets].find(player => player.ws === socket);

			if (!disconnectedPlayer) return;

			sockets.delete(disconnectedPlayer);
			console.log(`Player ${disconnectedPlayer.username} disconnected from match ${matchId}`);

			// Host leaves before game started, remove match and notify lobby
			if (disconnectedPlayer.username === match.host && match.status !== "started") {
				console.log(`Host ${match.host} disconnected. Ending match ${matchId}.`);
				broadcast("lobby-update", { type: "removed", match });
				match.status = "canceled";
				broadcastMatch(matchId, {
					type: "game-canceled",
					host: match.host,
					size: match.size,
					requiredPlayers: 0,
					players: [],
					status: match.status
				});
				sockets.forEach((player) => {
					player.ws.close();
				});
				matches.delete(matchId);
				lobbyMatches.delete(matchId);
				matchSockets.delete(matchId);
				return;
			}

			// Normal player leaves
			const wasReady = match.status === "ready";
			match.players = match.players.filter(player => player !== disconnectedPlayer.username);
			if (wasReady) {
				match.status = "waiting";
				broadcast("lobby-update", { type: "created", match });
				lobbyMatches.set(matchId, match);
				broadcastMatch(matchId, {
						type: "match-state",
						host: match.host,
						size: match.size,
						requiredPlayers: match.requiredPlayers,
						players: match.players,
						status: match.status
				});
				console.log("Match ${matchId} is available again.");
			}
			else if (match.status === "started") {

				match.state?.playerExit(socket, )
			}
			else {
				// update player count -> needs to be implemented in the frontend lobby
				broadcast("lobby-update", { type: "updated", match });
			}

			if (sockets.size === 0) {
				console.log(`All players disconnected from match ${matchId}. Cleaning up.`);
				lobbyMatches.delete(matchId);
				matchSockets.delete(matchId);
				matches.delete(matchId);
			}

		});
	});

	const pingCheck = setInterval(() => {
		wss.clients.forEach((socket) => {
			if (!aliveSockets.get(socket)) {
				socket.terminate();
				return;
			}
			aliveSockets.set(socket, false);
			socket.ping();
		});

	}, 5_000)
}
