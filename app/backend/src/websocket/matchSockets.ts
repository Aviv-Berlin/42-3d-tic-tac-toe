import { WebSocket } from "ws";
import { Match, matches, broadcast, lobbyMatches} from "../controllers/gameController.ts";

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
		if (player.ws.readyState === WebSocket.OPEN) {
			player.ws.send(message);
		}
	});
}

function handleStartGame(
	sender: PlayerConnection,
	sockets: Set<PlayerConnection>,
	match: Match,
	matchId: string
) {
	if (sender.username !== match.host)
		return;

	if (sockets.size < match.requiredPlayers) {
		match.status = "waiting";
		return;
	}

	match.status = "started";

	broadcastMatch(matchId, {
		type: "game-started",
		host: match.host,
		size: match.size,
		requiredPlayers: match.requiredPlayers,
		players: match.players,
		status: match.status
	});

	// initialize game ... handover sockets 
}

function handleCancelGame(
	sender: PlayerConnection,
	sockets: Set<PlayerConnection>,
	match: Match,
	matchId: string
) {
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

		sender.ws.send(JSON.stringify({
			type: "left-match"
		}));

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
		player.ws.close();
	});

	matches.delete(matchId);
	lobbyMatches.delete(matchId);
	matchSockets.delete(matchId);
}

export function handleMessage(
	message: WebSocket.RawData,
	socket: WebSocket,
	match: Match,
) {
	console.log("received message:", message.toString());

	const data = JSON.parse(message.toString());

	const sockets = matchSockets.get(match.id);
	if (!sockets) return;

	const sender = [...sockets].find(
		player => player.ws === socket
	);

	if (!sender) return;

	switch (data.type) {
		case "start-game":
			handleStartGame(sender, sockets, match, match.id);
			break;

		case "cancel-game":
			handleCancelGame(sender, sockets, match, match.id);
			break;

		default:
			console.log(`Unknown message type: ${data.type}`);
	}
}