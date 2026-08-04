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
			gameID: string
		}
	};

export function createGameStartMessage(gameID: string): GameStartMessage {
	return {
		type: "game-start",
		payload: { gameID }
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

export type WsMessage =
  JoinGameMessage
  | MoveMessage
  | GameStartMessage

  export default {
	createGameStartMessage
  }
