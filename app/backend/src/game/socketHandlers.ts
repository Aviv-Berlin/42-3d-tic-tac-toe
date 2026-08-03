import { WsMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";

export function handleMessage(message: WsMessage, ws: WebSocket, games: GameState[]) {
	console.log(`Received message: ${message}`);
		switch (message.type) {
			case "join-game":
				const data = message.payload.gameData;
				const game = games.find(game => game.getID() === data.gameID);
				if (game) {
					game.addPlayer(ws);
					console.log(`Added player to game ${data.gameID}`);
				}
				else {
					const newGame = new GameState(data, 2);
					newGame.addPlayer(ws);
					games.push(newGame);
					console.log(`Game ${data.gameID} created`);
				}
				break;
			case "move":
				break;
			default:
				console.log(`Unknown messaage: ${message}`);
		}
}
