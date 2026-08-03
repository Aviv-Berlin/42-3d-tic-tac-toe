import { WsMessage, JoinGameMessage, MoveMessage, GameStartMessage } from "../../../shared/messages"





// function joinGame(message: JoinGameMessage, ws: WebSocket, games: GameState[]) {
// 	const data = message.payload.gameData;
// 	const game = games.find(game => game.getID() === data.gameID);
// 	if (game) {
// 		game.addPlayer(ws);
// 		console.log(`Added player to game ${data.gameID}`);
// 	}
// 	else {
// 		const newGame = new GameState(data, 2);
// 		newGame.addPlayer(ws);
// 		games.push(newGame);
// 		console.log(`Game ${data.gameID} created`);
// 	}
// }

export function handleMessage(message: WsMessage) {
	console.log(`Received message: ${message}`);
	switch (message.type) {
		case "game-start":
			console.log(`Game ${message.payload.gameID} started`)
			break;
		case "move":
			break;
		default:
			console.log(`Unknown message: ${message}`);
	}
}
