import { WebSocket } from "ws";
import { Match, matches, broadcast, lobbyMatches} from "../controllers/gameController.ts";
import { GameState } from "../game/GameState.ts";
import { AiPlayer } from "../game/AIPlayer.ts";

import { GameData} from "../../../shared/game.ts";
import  createPlayers from "../../../frontend/src/utils/players.ts"
import { CancelGameMessage, PlayGameMessage, PlayLocalMessage } from "../../../shared/messages.ts"


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
		if (player.ws && player.ws.readyState === WebSocket.OPEN) {
			player.ws.send(message);
		}
	});
}

export function initGame(match: Match, sockets: Set<PlayerConnection>, games: GameState[]) {
	
	// construct GameData from trusted match data
    const gameMode = match.mode;
	const [player1, player2] = createPlayers(match.players, gameMode);
    const level = match.level;
	const gameData: GameData= {
      player1, // = host
      player2,
      level,
      gameMode,
      moves: [],
      size: match.size,
      isFinished: false,
      isDraw: false,
      winner: null,
      gameStart: 0,
      gameEnd: 0,
      gameID: match.id
   	 };
  
  	console.log("GameData:", gameData);

    // create GameState
	const game = new GameState(gameData, match.requiredPlayers);

	if (gameData.player2.type === "ai") {
			const ai = new AiPlayer(game, gameData.level, gameData.size);
			game.addAiPlayer(ai, "ai");
		}
	else if (gameData.player2.type === "guest"){
			sockets.forEach(player => {
				if (player.ws)
				game.addPlayer(player.ws, "guest");
			})	
	}
	// attach existing WebSockets
	sockets.forEach(player => {
		if (player.ws)
			game.addPlayer(player.ws, player.username);
	});
	
    // add to games
	games.push(game);
	
	console.log(`Game ${match.id} created`);

	// if (data.player2.type === "ai") {
	// 	const ai = new AiPlayer(game, data.level, data.size);
	// 	game.addAiPlayer(ai, "ai");
	// }
	// else if (data.player2.type === "guest")
	// 	game.addPlayer(ws, "guest");

	//game.startGame();

	return gameData;
}

export function PlayLocal(message: PlayLocalMessage, socket: WebSocket, games: GameState[]) {
	
	const match = message.payload.match;
	const username = match.host;
	const ws = socket;

	const sockets = new Set<PlayerConnection>();
	sockets.add({
		username,
		ws
	})

	const gameData = initGame(match, sockets, games);

	match.status = "started";

	socket.send(JSON.stringify({
		type: "game-init",
		id: match.id,
		host: match.host,
		mode: match.mode,
		level: match.level,
		size: match.size,
		requiredPlayers: match.requiredPlayers,
		players: match.players,
		status: match.status,
		gameData
	}))
}

export function PlayGame(message: PlayGameMessage, socket: WebSocket, games: GameState[]
) {

	const matchId = message.payload.matchId;
	const sockets = matchSockets.get(matchId);
 	if (!sockets) return;

	const match = matches.get(matchId);
	if (!match) return

	const sender = [...sockets].find(
		player => player.ws === socket
	);

	if (!sender) return;

	if (sender.username !== match.host)
		return;

	if (sockets.size < match.requiredPlayers) {
		match.status = "waiting";
		return;
	}

	const gameData = initGame(match, sockets, games);

	match.status = "started";

	console.log("here");
	broadcastMatch(match.id, {
		type: "game-init",
		host: match.host,
		mode: match.mode,
		level: match.level,
		size: match.size,
		requiredPlayers: match.requiredPlayers,
		players: match.players,
		status: match.status,
		gameData
	});
}

export function CancelGame(message: CancelGameMessage, socket: WebSocket) {

	const matchId = message.payload.matchId;
	const sockets = matchSockets.get(matchId);
 	if (!sockets) return;

	const match = matches.get(matchId);
	if (!match) return

	const sender = [...sockets].find(
		player => player.ws === socket
	);
	if (!sender) return;
	
	// Player leaves
	if (sender.username !== match.host) {
		match.players = match.players.filter(
			player => player !== sender.username
		);

		match.status = "waiting";

		broadcast("lobby-update", {
			type: "created",
			match
		});

		lobbyMatches.set(matchId, match);

		broadcastMatch(matchId, {
			type: "match-state",
			host: match.host,
			size: match.size,
			requiredPlayers: match.requiredPlayers,
			players: match.players,
			status: match.status
		});

		if (sender.ws)
			sender.ws.send(JSON.stringify({
			type: "left-match"
		}));

		if (sender.ws)
			sender.ws.close();

		return;
	}

	// Host cancels
	console.log(
		`Host ${match.host} canceled match ${matchId}.`
	);

	if (match.players.length < match.requiredPlayers) {
		broadcast("lobby-update", {
			type: "removed",
			match
		});
	}

	match.status = "canceled";

	broadcastMatch(matchId, {
		type: "game-canceled",
		host: match.host,
		size: match.size,
		requiredPlayers: 0,
		players: [],
		status: match.status
	});

	sockets.forEach(player => {
		if (player.ws)
			player.ws.close();
	});

	matches.delete(matchId);
	lobbyMatches.delete(matchId);
	matchSockets.delete(matchId);
}

// export function handleMessage(
// 	message: WebSocket.RawData,
// 	socket: WebSocket,
// 	match: Match,
// 	games: GameState[]
// ) {
// 	console.log("received message:", message.toString());

// 	const data = JSON.parse(message.toString());

// 	const sockets = matchSockets.get(match.id);
// 	if (!sockets) return;

// 	const sender = [...sockets].find(
// 		player => player.ws === socket
// 	);

// 	if (!sender) return;

// 	switch (data.type) {
// 		case "play-game":
// 			handleStartGame(sender, sockets, match, games);
// 			break;

// 		case "cancel-game":
// 			handleCancelGame(sender, sockets, match, match.id);
// 			break;

// 		default:
// 			console.log(`Unknown message type: ${data.type}`);
// 	}
// }