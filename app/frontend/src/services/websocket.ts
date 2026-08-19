import { createLeaveMatchMessage } from "../../../shared/messages";

let socket: WebSocket | null = null;
let currentMatchId: string | null = null;

export function openSocket(matchId: string, username: string): WebSocket {
	if (socket && socket.readyState !== WebSocket.CLOSED && currentMatchId === matchId)
		return socket;

	socket = new WebSocket(`ws://localhost:3001/v1/game/${matchId}?username=${username}`)

	currentMatchId = matchId;

	socket.onopen = () => {
		console.log("[WS/open] WebSocket connected");
	}

	socket.onerror = (error) => {
		console.error("[WS/error] WebSocket error: ", error);
	}

	socket.onclose = () => {
		console.log("[WS/close] Websocket disconnected");
		socket = null;
		currentMatchId = null;
	}

	return socket;
}

export function sendMessage(message: unknown){
	if (socket?.readyState === WebSocket.OPEN){
		socket.send(JSON.stringify(message));
	}
}

export function getSocket(): WebSocket | null {
	return socket;
}

export function closeSocket() {

	if (!socket)
		return;

	sendMessage(createLeaveMatchMessage())
	socket.close();
	socket = null;
	currentMatchId = null;
}
