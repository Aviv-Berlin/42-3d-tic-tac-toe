import { WsMessage, JoinGameMessage, MoveMessage, ExitMessage, StartGameMessage, createEndMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";
import { AiPlayer } from "./AIPlayer.ts";

import { CancelGame, PlayGame } from "../websocket/matchSockets.ts"
import { Match } from "../controllers/gameController.ts";

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

function StartGame(message: StartGameMessage, games: GameState[]){
	const data = message.payload.gameData;
	let game = games.find(game => game.getID() === data.gameID);
	if (game)
		game.startGame();
}


export function makeMove(message: MoveMessage, ws: WebSocket, games: GameState[]) {
	console.log(`no. of games: ${games.length}`);
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
}

function playerExit(message: ExitMessage, ws: WebSocket, games: GameState[]) {
	const data = message.payload;
	let game = games.find(game => game.getID() === data.gameID);
	if (!game) {
		console.log(`Invalid gameID ${data.gameID}`);
		ws.send(JSON.stringify(`Invalid gameID ${data.gameID}`));
		return ;
	}
	game.playerExit(ws, data.IAm);
	game.removeGame(games);
}


export function handleMessage(message: WsMessage, ws: WebSocket, match: Match) {
	//console.log(`Received message: ${message}`);
	console.log(`TYPE: ${message.type} \n`)
	switch (message.type) {
			case "play-game":
				PlayGame(message, ws, match);
				console.log(`Received play-game msg: ${message}`);
				break;
			case "cancel-game":
				CancelGame(message, ws);
				console.log(`Received cancel-game msg: ${message}`);
				break;
			case "start-game":
				StartGame(message, match);
				console.log(`Received start-game msg: ${message}`);
				break;
			case "join-game":
				joinGame(message, ws, match); // prev. joinGame
				console.log(`Received join-game msg: ${message}`);
				break;
			case "move":
				makeMove(message, ws, match);
				break;
			case "exit":
				playerExit(message, ws, match);
				break;
			default:
				console.log(`Unknown message: ${message}`);
		}
}


