import { WebSocketServer, WebSocket} from "ws";
import type http from "http";
import { broadcastMatch, matchSockets, handlePlayerLeave } from "../websocket/matchSockets.ts";
import { lobbyMatches, matches, broadcast } from "../controllers/gameController.ts";

import { handleMessage } from "../game/socketHandlersBE.ts";
import { WsMessage } from "../../../shared/messages.ts"

//export const games: GameState[] = [];

export function setupWebSocket(server: http.Server) {

	const wss = new WebSocketServer({ server });

	wss.on("connection", (socket: WebSocket, request: http.IncomingMessage) => {

		const url = new URL(request.url ?? "", "http://localhost");

		const matchId = url.pathname.split("/").pop();
		const username = url.searchParams.get("username");

		if (!matchId || !username) {
			console.log("[WS/connected] No match ID provided");
			socket.close();
			return;
		}

		let match = matches.get(matchId);
		if (!match) {
			console.log(`[WS/connected] Match not found: ${matchId}`);
			//socket.send(JSON.stringify({ type: "error", message: "Match not found" }));
			//socket.close();
			//return;
		}

		if (!matchSockets.has(matchId)) {
			matchSockets.set(matchId, new Set());
		}

		const sockets = matchSockets.get(matchId)!;
		const existingPlayer = [...sockets].find(player => player.username === username)

		if (existingPlayer){
			console.log(`[WS/connection] Player ${username} reconnected to match ${matchId}.`)
			existingPlayer.ws = socket;
			if (existingPlayer.disconnectTimer){
				clearTimeout(existingPlayer.disconnectTimer)
				existingPlayer.disconnectTimer = undefined;
			}
			if (match && match.status === "started")
				match.state?.updatePlayerSocket(socket, existingPlayer.username)
		}
		else{
			sockets?.add({
				username: username,
				ws: socket,
				disconnectTimer: undefined
			})
		}

		// matchSockets.get(matchId)?.add({
		// 	username: username,
		// 	ws: socket
		// });

		// Send the current match state to the newly connected client
		if (match){
			socket.send(JSON.stringify({
			type: "match-state",
			host: match.host,
			size: match.size,
			requiredPlayers: match.requiredPlayers,
			players: match.players,
			status: match.status
		 }));
		}

		 // use later for broadcasting messages to all clients in the match
		 socket.on("message", (event) => {

			const message: WsMessage = JSON.parse(event.toString());
			console.log(`[WS/message] Server received message (type: ${message.type})`);
			// console.log(`No. of matches: ${matches.size}`);

			if (message.type === "leave-match"){
				const sockets = matchSockets.get(matchId);
				if (!sockets) return;
				const player = [...sockets].find(
					player => player.ws === socket
				);
				
				if (!player) return;

				handlePlayerLeave(matchId, player);

				return;
			}
			//handleMessage(message, socket,	match, games)
			if (!match)
				match = matches.get(matchId);
			if (!match)
				handleMessage(message, socket, null);
			else
				handleMessage(message, socket, match);
		});

		socket.on("close", () => {
			const sockets = matchSockets.get(matchId);
			if (!sockets) return;

			const player = [...sockets].find(
				player => player.ws === socket
			);

			if (!player) return;

			console.log(`[WS/close] Player ${player.username} disconnected from match ${matchId}`)

			player.ws = null;

			player.disconnectTimer = setTimeout(() => {
				if (player.ws !== null){
					return;
				}

				console.log(`[WS/close] Player ${player.username} did not reconnect`)

				handlePlayerLeave(matchId, player);
			}, 5000);
		});
	});
}
