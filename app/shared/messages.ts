import { GridPosition, CellState, PLAYER_STATES} from "../frontend/src/game/Types.ts";
import { GameData} from "../frontend/src/types/game.ts";

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
