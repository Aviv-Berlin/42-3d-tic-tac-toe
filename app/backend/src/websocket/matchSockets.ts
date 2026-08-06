import { WebSocket } from "ws";

export interface PlayerConnection {
	username: string;
	ws: WebSocket;
}

export const matchSockets = new Map<string, Set<PlayerConnection>>();

export function broadcastMatch(matchId: string, data: unknown) {
	const sockets = matchSockets.get(matchId);

	if (!sockets) {
		return;
	}

	const message = JSON.stringify(data);

	sockets.forEach(( player) => {
		if (player.ws.readyState === WebSocket.OPEN) {
			player.ws.send(message);
		}
	});
}