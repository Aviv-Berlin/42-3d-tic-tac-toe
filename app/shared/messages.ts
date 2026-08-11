import { GridPosition, CellState, PLAYER_STATES} from "./game/Types";
import { GameData} from "./game";

//client -> server


export type JoinGameMessage =
	{ type: "join-game";
		payload: {
			gameData: GameData,
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
  JoinGameMessage
  | GameStartMessage
  | MoveMessage
  | TurnMessage
  | EndMessage
  | ExitMessage


export default {
	createGameStartMessage,
	createJoinGameMessage,
	createMoveMessage,
	createEndMessage
  }
