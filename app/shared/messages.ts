import { GridPosition, CellState, PLAYER_STATES} from "./game/Types";
import { GameData} from "./game";
import { Match } from "../backend/src/controllers/gameController"
import { PlayerConnection } from "../backend/src/websocket/matchSockets";

//client -> server
export type PlayLocalMessage =
{ type: "play-local";
	payload: {
		match: Match
	}
}

export function createPlayLocalMessage(match: Match): PlayLocalMessage {
	return {
		type: "play-local",
		payload: { match }
	}
}

export type PlayGameMessage =
{ type: "play-game";
	payload: {
		matchId: string
	}
}

export function createPlayGameMessage(matchId: string): PlayGameMessage {
	return {
		type: "play-game",
		payload: { matchId }
	}
}

export type CancelGameMessage =
{ type: "cancel-game";
	payload: {
		matchId: string
	}
}

export function createCancelGameMessage(matchId: string): CancelGameMessage {
	return {
		type: "cancel-game",
		payload: { matchId }
	}
}

export type StartGameMessage =
{ type: "start-game";
	payload: {
		gameData: GameData
	}
}

export function createStartGameMessage(gameData: GameData): StartGameMessage {
	return {
		type: "start-game",
		payload: { gameData }
	}
}

export type JoinGameMessage =
{ type: "join-game";
	payload: {
		gameData: GameData,
	}
}

export type InitGameMessage =
{ type: "init-game";
	payload: {
		match: Match,
	}
}

export function createInitGameMessage(match: Match): InitGameMessage {
	return {
		type: "init-game",
		payload: { match }
	}
}

export function createJoinGameMessage(gameData: GameData): JoinGameMessage {
	return {
		type: "join-game",
		payload: { gameData }
	}
}

export type ExitMessage =
	{ type: "exit";
		payload: {
			gameID: string;
			IAm: number;
		}
	}

export function createExitMessage(gameID: string, IAm: number): ExitMessage {
	return {
		type: "exit",
			payload: {
				gameID,
				IAm
			}
	}
}

//server -> client
export type TurnMessage =
	{ type: "turn";
		payload: {
			gameID: string,
			playsNow: number
		}
	};

export function CreateTurnMessage(gameID: string, playsNow: number): TurnMessage {
	return {
		type: "turn",
		payload: {
			gameID,
			playsNow }
	}
}

export type GameStartMessage =
{ type: "game-start";
	payload: {
		gameID: string,
		playerNames: string[],
		nPlayers: number,
		youAre: number
	}
};

export function createGameStartMessage(gameID: string, playerNames: string[],
		 nPlayers: number, youAre: number): GameStartMessage {
	return {
		type: "game-start",
		payload: {
			gameID,
			playerNames,
			nPlayers,
			youAre }
	}
}

export type EndMessage =
	{ type: "end";
		payload: {
			gameData: GameData;
			winningPos: GridPosition [] | null;
			whoExited: number;
		}
	}

export function createEndMessage(gameData: GameData, winningPos: GridPosition[] | null, whoExited: number): EndMessage {
	return {
		type: "end",
			payload: {
				gameData,
				winningPos,
				whoExited
			}
	}
}

//shared
export type MoveMessage =
{ type: "move";
	payload: {
		gameID: string
		player: CellState
		playerIndex: number
		position: GridPosition
	}
};

export function createMoveMessage(gameID: string, player: CellState, playerIndex: number, position: GridPosition): MoveMessage {
	return {
		type: "move",
		payload: {
			gameID,
			player,
			playerIndex,
			position
		}
	};
}

export type WsMessage =
  | PlayLocalMessage
  | PlayGameMessage
  | CancelGameMessage
  | StartGameMessage
  | JoinGameMessage
  | GameStartMessage
  | MoveMessage
  | TurnMessage
  | EndMessage
  | ExitMessage


export default {
	createPlayLocalMessage,
	createGameStartMessage,
	createJoinGameMessage,
	createMoveMessage,
	createCancelGameMessage,
	createPlayGameMessage,
	createStartGameMessage,
	createEndMessage
  }
