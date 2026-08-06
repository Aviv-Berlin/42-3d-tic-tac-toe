import { WsMessage, JoinGameMessage, MoveMessage, createMoveMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";
import { AiPlayer } from "./AIPlayer.ts";



function joinGame(message: JoinGameMessage, ws: WebSocket, games: GameState[]) {
	const data = message.payload.gameData;
	let game = games.find(game => game.getID() === data.gameID);

	if (game) {
		game.addPlayer(ws, data.player1.username);
		console.log(`Added player to game ${data.gameID}`);
	}
	else {
		game = new GameState(data, 2);
		game.addPlayer(ws, data.player1.username);
		games.push(game);
		console.log(`Game ${data.gameID} created`);
	}
	if (data.player2.type === "ai") {
		const ai = new AiPlayer(game, data.level, data.size);
		game.addAiPlayer(ai, "ai");
	}
	else if (data.player2.type === "guest")
		game.addPlayer(ws, "guest");
	game.startGame();
}

export function makeMove(message: MoveMessage, ws: WebSocket, games: GameState[]) {
	const data = message.payload;
	let game = games.find(game => game.getID() === data.gameID);
	if (!game) {
		console.log(`Invalid gameID ${data.gameID}`);
		ws.send(JSON.stringify(`Invalid gameID ${data.gameID}`));
		return ;
	}
	if (game.placeMove(data.position, data.player)) {
		return ;
	}
	// const msg = createMoveMessage(data.gameID, data.player, )
	//game.broadcastMessage(message);

}


export function handleMessage(message: WsMessage, ws: WebSocket, games: GameState[]) {
	//console.log(`Received message: ${message}`);
	console.log(`TYPE: ${message.type} \n`)
	switch (message.type) {
			case "join-game":
				joinGame(message, ws, games);
				console.log(`Received join-game msg: ${message}`);
				break;
			case "move":
				makeMove(message, ws, games);
				break;
			default:
				console.log(`Unknown message: ${message}`);
		}
}
