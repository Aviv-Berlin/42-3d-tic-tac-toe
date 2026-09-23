import { WsMessage } from "../../../shared/messages"

export function handleMessage(message: WsMessage) {
	console.log(`Received message: ${message}`);
	switch (message.type) {
		case "game-start":
			console.log(`Game ${message.payload.gameID} started`);
			break;
		case "move":
			break;
		default:
			console.log(`Unknown message: ${message}`);
	}
}
