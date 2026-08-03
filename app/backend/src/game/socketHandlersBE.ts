import { WsMessage, JoinGameMessage, MoveMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";



function joinGame(message: JoinGameMessage, ws: WebSocket, games: GameState[]) {
	const data = message.payload.gameData;
	let game = games.find(game => game.getID() === data.gameID);
	if (game) {
		game.addPlayer(ws);
		console.log(`Added player to game ${data.gameID}`);
	}
	else {
		game = new GameState(data, 2);
		game.addPlayer(ws);
		games.push(game);
		console.log(`Game ${data.gameID} created`);
	}
	game.startGame();
}

export function handleMessage(message: WsMessage, ws: WebSocket, games: GameState[]) {
	console.log(`Received message: ${message}`);
		switch (message.type) {
			case "join-game":
				joinGame(message, ws, games);
				break;
			case "move":
				break;
			default:
				console.log(`Unknown message: ${message}`);
		}
}
