
let socket: WebSocket | null = null;
let currentMatchId: string | null = null;

export function openSocket(matchId: string, username: string): WebSocket {
	if (socket && socket.readyState !== WebSocket.CLOSED && currentMatchId === matchId)
		return socket;

	console.log("username: ", username);
	console.log("matchId:", matchId);

	socket = new WebSocket(`ws://localhost:3001/v1/game/${matchId}?username=${username}`)

	currentMatchId = matchId;

	socket.onopen = () => {
		console.log("WebSocket connected");
	}

	socket.onerror = (error) => {
		console.error("WebSocket error: ", error);
	}

	socket.onclose = () => {
		console.log("Websocket disconnected");
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
	if (socket){
		socket.close();
		socket = null;
		currentMatchId = null;
	}
}
