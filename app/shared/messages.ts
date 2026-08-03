import { GridPosition, CellState, PLAYER_STATES} from "./game/Types";
import { GameData} from "./game";

export type WsMessage =
  | { type: "join-game";
		payload: {
			gameData: GameData,
			player: string
  		}
	}
  | { type: "move";
		payload: {
			gameID: string
			player: CellState,
			position: GridPosition
		}
	};
