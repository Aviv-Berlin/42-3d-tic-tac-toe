import { WsMessage, JoinGameMessage, MoveMessage, createMoveMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";



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
	game.startGame();

//dummy move
	let msg = createMoveMessage(data.gameID, 1, {x:1, y:1, z:1});
	ws.send(JSON.stringify(msg));
	msg = createMoveMessage(data.gameID, 2, {x:2, y:2, z:1});
	ws.send(JSON.stringify(msg));
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
		// yourTurn();
		return ;
	}
	// const msg = createMoveMessage(data.gameID, data.player, )
	game.broadcastMessage(message);

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
