import { GridPosition, CellState } from "./game/Types";

export type PlayerType = "real" | "ai" | "guest";
export type GameMode = "online" | "ai" | "local";
export type AiLevel = 0 | 1 | 2 | 3;

export interface PlayerData {
  type: PlayerType;
  username: string;
}

export interface ActiveGame {
	id: string;
	host: string;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started";
}

export interface Move {
  pos: GridPosition;
  player: CellState;
  time: Date;
}

export interface GameData {
  player1: PlayerData;
  player2: PlayerData;
  level: AiLevel;
  gameMode: GameMode;
  winner: PlayerData | null;
  moves: Move[];
  size: number;
  isFinished: boolean;
  isDraw: boolean;
  gameStart: number;
  gameEnd: number;
  gameID: string;
  endMessage: string | null;
}
