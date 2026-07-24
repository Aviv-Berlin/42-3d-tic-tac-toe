import { GridPosition, CellState } from "../game/Types";

export type PlayerType = "real" | "ai" | "guest";
export type GameMode = "online" | "ai" | "local";
export type AiLevel = 0 | 1 | 2 | 3;

export interface PlayerData {
  type: PlayerType;
  username: string;
}

export interface Move {
  pos: GridPosition;
  player: CellState;
}

export interface GameData {
  player1: PlayerData;
  player2: PlayerData;
  level: AiLevel;
  winner: PlayerData | null;
  moves: Move[] | null;
  size: number;
  isFinished: boolean;
  isDraw: boolean;
  gameStart: number;
  gameEnd: number;
}
