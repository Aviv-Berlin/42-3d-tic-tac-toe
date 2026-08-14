import { WsMessage, JoinGameMessage, MoveMessage, ExitMessage, StartGameMessage, createEndMessage } from "../../../shared/messages.ts"
import { WebSocket } from "ws";
import { GameState } from "./GameState.ts";
import { AiPlayer } from "./AIPlayer.ts";

import { CancelGame, PlayGame, PlayLocal } from "../websocket/matchSockets.ts"
import { Match } from "../controllers/gameController.ts";

function joinGame(message: JoinGameMessage, ws: WebSocket, match: Match) {
	const data = message.payload.gameData;
	let game = match.state;

	if (game) {
		game.addPlayer(ws, data.player1.username);
		console.log(`Added player to game ${data.gameID}`);
	}
	else {
		console.log(`Game not found inside match, setting up GameState`);
		game = new GameState(data, 2);
		game.addPlayer(ws, data.player1.username);
		match.state = game; //games.push(game);
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

function StartGame(message: StartGameMessage, match: Match){
	// const data = message.payload.gameData;
	const game = match.state;
	if (game)
		game.startGame();
}


export function makeMove(message: MoveMessage, ws: WebSocket, match: Match) {
	const data = message.payload;
	const game = match.state;
	if (!game) {
		console.log(`Error: gameState not yet created ${data.gameID}`);
		ws.send(JSON.stringify(`Error: gameState not yet created ${data.gameID}`));
		return ;
	}
	if (game.placeMove(data.position, data.player)) {
		return ;
	}
}

function playerExit(message: ExitMessage, ws: WebSocket, match: Match) {
	const data = message.payload;
	let game = match.state;
	if (!game) {
		console.log(`Invalid gameID ${data.gameID}`);
		ws.send(JSON.stringify(`Invalid gameID ${data.gameID}`));
		return ;
	}
	game.playerExit(ws, data.IAm);
}


export function handleMessage(message: WsMessage, ws: WebSocket, match: Match) {
	//console.log(`Received message: ${message}`);
	console.log(`TYPE: ${message.type} \n`)
	switch (message.type) {
			case "play-local":
				PlayLocal(message, ws);
				console.log(`Received play-local msg: ${message}`);
				break;
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


