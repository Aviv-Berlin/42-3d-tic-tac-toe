import { WebSocket } from "ws";
import { Match, matches, broadcast, lobbyMatches} from "../controllers/gameController.ts";
import { GameState } from "../game/GameState.ts";
import { AiPlayer } from "../game/AIPlayer.ts";

import { GameData} from "../../../shared/game.ts";
import  createPlayers from "../../../frontend/src/utils/players.ts"
import { CancelGameMessage, PlayGameMessage, PlayLocalMessage } from "../../../shared/messages.ts"
import { match } from "assert";


export interface PlayerConnection {
	username: string;
	ws: WebSocket | null;
	disconnectTimer?: NodeJS.Timeout; // ? makes property optional
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

export function initGame(match: Match, sockets: Set<PlayerConnection>) {

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
      gameID: match.id,
	  endMessage: null
   	 };

  	console.log("[InitGame] GameData:", gameData);

    // create GameState
	const game = new GameState(gameData, match.requiredPlayers);

	// attach existing WebSockets
	sockets.forEach(player => {
		if (player.ws) {
			game.addPlayer(player.ws, player.username);
			//console.log(`added real player successfully`);
		}
	});

	if (gameData.player2.type === "ai") {
			const ai = new AiPlayer(game, gameData.level, gameData.size);
			game.addAiPlayer(ai, "ai");
		}
	else if (gameData.player2.type === "guest"){
				//console.log(`adding guest...`);
				game.addPlayer(null, "guest");
		}

    // add to games
	match.state = game; //games.push(game);

	return gameData;
}

export function PlayLocal(message: PlayLocalMessage, socket: WebSocket) {

	const match = message.payload.match;
	const username = match.host;
	const ws = socket;

	const sockets = new Set<PlayerConnection>();
	sockets.add({
		username,
		ws
	})

	matches.set(match.id, match);
	matchSockets.set(match.id, sockets);

	const gameData = initGame(match, sockets);
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

export function PlayGame(message: PlayGameMessage, socket: WebSocket, match: Match
) {

	const matchId = message.payload.matchId;
	const sockets = matchSockets.get(matchId);
 	if (!sockets) return;

	// const match = matches.get(matchId);
	// if (!match) return

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

	const gameData = initGame(match, sockets);

	match.status = "started";

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
		`[WR/CancelGame] Host ${match.host} canceled match ${matchId}.`
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

export function handlePlayerLeave(matchId: string, disconnectedPlayer: PlayerConnection){

	const sockets = matchSockets.get(matchId);
	const match = matches.get(matchId);
	if (!sockets || !disconnectedPlayer || !match) return;

	sockets.delete(disconnectedPlayer);
	console.log(`[WR/PlayerLeave] Player ${disconnectedPlayer.username} left match ${matchId}`);

	// Host leaves before game started, remove match and notify lobby
	if (match && disconnectedPlayer.username === match.host && match.status !== "started") {
		console.log(`[WR/PlayerLeave] Host ${match.host} disconnected. Canceling match ${matchId}.`);
		broadcast("lobby-update", { type: "removed", match });
		match.status = "canceled";
		broadcastMatch(matchId, {
			type: "game-canceled",
			host: match.host,
			size: match.size,
			requiredPlayers: 0,
			players: [],
			status: match.status
		});
		sockets.forEach((player) => {
			if (player.ws)
				player.ws.close();
		});
		matches.delete(matchId);
		lobbyMatches.delete(matchId);
		matchSockets.delete(matchId);
		return;
	}

	// Normal player leaves
	if (match && match.status !== "started"){
		const wasReady = match.status === "ready";
		match.players = match.players.filter(player => player !== disconnectedPlayer.username);
		if (wasReady) {
			match.status = "waiting";
			broadcast("lobby-update", { type: "created", match });
			lobbyMatches.set(matchId, match);
			broadcastMatch(matchId, {
					type: "match-state",
					host: match.host,
					size: match.size,
					requiredPlayers: match.requiredPlayers,
					players: match.players,
					status: match.status
			});
			console.log(`[WR/PlayerLeave] Match ${matchId} is available again.`);
		}
		else {
			// update player count -> needs to be implemented in the frontend lobby
			broadcast("lobby-update", { type: "updated", match });
		}
		
		if (sockets.size === 0) {
			console.log(`[WR/PlayerLeave] All players disconnected from match ${matchId}. Cleaning up.`);
			lobbyMatches.delete(matchId);
			matchSockets.delete(matchId);
			matches.delete(matchId);
		}	
	}
}
