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

//server -> client
export type GameStartMessage =
	{ type: "game-start";
		payload: {
			gameID: string,
			playerNames: string[],
			nPlayers: number,
			firstPlayer: number,
			youAre: number
		}
	};

export function createGameStartMessage(gameID: string, playerNames: string[],
		 nPlayers: number, firstPlayer: number, youAre: number): GameStartMessage {
	return {
		type: "game-start",
		payload: {
			gameID,
			playerNames,
			nPlayers,
			firstPlayer,
			youAre }
	}
}

//shared
export type MoveMessage =
	{ type: "move";
		payload: {
			gameID: string
			player: CellState,
			position: GridPosition
		}
	};

export function createMoveMessage(gameID: string, player: CellState, position: GridPosition): MoveMessage {
	return {
		type: "move",
		payload: {
			gameID,
			player,
			position
		}
	};
}

export type WsMessage =
  JoinGameMessage
  | GameStartMessage
  | MoveMessage

export default {
	createGameStartMessage,
	createJoinGameMessage,
	createMoveMessage
  }
