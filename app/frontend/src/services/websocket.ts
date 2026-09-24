// import { createLeaveMatchMessage } from "../../../shared/messages";

// let socket: WebSocket | null = null;
// let currentMatchId: string | null = null;

// let socketReadyReject: ((error: Event) => void) | null = null;

// let socketReadyResolve: ((socket: WebSocket) => void) | null = null;

// const socketReady = new Promise<WebSocket>((resolve) => {
//     socketReadyResolve = resolve;
// });

// export function openSocket(matchId: string, username: string): WebSocket {

// 	console.log(`[openSocket] Username: ${username}, matchId: ${matchId}`);
// 	if (socket && socket.readyState !== WebSocket.CLOSED && currentMatchId === matchId)
// 		return socket;

// 	const loc = window.location;
// 	let uri;
// 	if (loc.protocol === "https:") {
//  	   uri = "wss:";
// 	} else {
//  	   uri = "ws:";
// 	}
// 	uri += "//" + loc.host;
// 	uri += `/ws/v1/game/${matchId}?username=${username}`;
// 	socket = new WebSocket(uri);

// 	currentMatchId = matchId;


// 	socket.onopen = () => {
// 		console.log("[WS/open] WebSocket connected");
// 		socketReadyResolve?.(socket!);
// 	}

// 	socket.onerror = (error) => {
// 		console.error("[WS/error] WebSocket error: ", error);
// 		socketReadyReject?.(error);
// 	}

// 	socket.onmessage = (event: MessageEvent) => {
//     const data = JSON.parse(event.data);

//     if (data.type === "error") {
//         console.log("[WS/error message]", data.message);
//     }
// 	}


// 	socket.onclose = () => {
// 		console.log("[WS/close] Websocket disconnected");
// 		socket = null;
// 		currentMatchId = null;
// 		socketReady = null;
// 		socketReadyResolve = null;
// 		socketReadyReject = null;
// 	}

// 	return socket;
// }

// export function sendMessage(message: unknown){
// 	if (socket?.readyState === WebSocket.OPEN){
// 		socket.send(JSON.stringify(message));
// 	}
// }

// export function getSocket(): WebSocket | null {
// 	return socket;
// }

// async function waitForSocket() {
//     // If it's already open, don't wait
//     if (socket?.readyState === WebSocket.OPEN) {
//         return socket;
//     }

//     // Otherwise wait for the existing connection
//     return await socketReady;
// }

// export function closeSocket() {

// 	if (!socket)
// 		return;

// 	sendMessage(createLeaveMatchMessage())
// 	socket.close();
// 	socket = null;
// 	currentMatchId = null;
// }

import { createLeaveMatchMessage } from "../../../shared/messages";

let socket: WebSocket | null = null;
let currentMatchId: string | null = null;

let socketCreatedResolve: ((socket: WebSocket) => void) | null = null;
let socketCreated = createSocketCreatedPromise();

function createSocketCreatedPromise(): Promise<WebSocket> {
	return new Promise<WebSocket>((resolve) => {
		socketCreatedResolve = resolve;
	});
}

export function openSocket(matchId: string, username: string): WebSocket {
	console.log(`[openSocket] Username: ${username}, matchId: ${matchId}`);

	if (
		socket &&
		socket.readyState !== WebSocket.CLOSED &&
		currentMatchId === matchId
	) {
		return socket;
	}

	const loc = window.location;
	let uri;

	if (loc.protocol === "https:") {
		uri = "wss:";
	} else {
		uri = "ws:";
	}

	uri += "//" + loc.host;
	uri += `/ws/v1/game/${matchId}?username=${username}`;

	socket = new WebSocket(uri);
	socketCreatedResolve?.(socket);
	currentMatchId = matchId;

	socket.onopen = () => {
		console.log("[WS/open] WebSocket connected");
	};

	socket.onerror = (error) => {
		console.error("[WS/error] WebSocket error: ", error);
	};

	socket.onmessage = (event: MessageEvent) => {
		const data = JSON.parse(event.data);

		if (data.type === "error") {
			console.log("[WS/error message]", data.message);
		}
	};

	socket.onclose = () => {
		console.log("[WS/close] Websocket disconnected");

		socket = null;
		currentMatchId = null;

		// Prepare a new Promise for the next connection
		socketCreated = createSocketCreatedPromise();
	};

	return socket;
}

export function sendMessage(message: unknown) {
	if (socket?.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));
	}
}

export function getSocket(): WebSocket | null {
	return socket;
}

export async function waitForSocket(): Promise<WebSocket> {
	if (socket) {
		return socket;
	}

	return socketCreated;
}

export function closeSocket() {
	if (!socket)
		return;

	sendMessage(createLeaveMatchMessage());

	socket.close();
}