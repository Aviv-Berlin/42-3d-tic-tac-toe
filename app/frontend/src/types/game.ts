export type PlayerType = "real" | "ai" | "guest";

export type GameMode = "online" | "ai" | "local";

export interface Player {
  type: PlayerType;
  username: string;
}

export type Move = [x: number, y: number, z: number];

export interface GameData {
  player1: Player;
  player2: Player;
  winner: Player | null;
  moves: Move[];
  size: number;
  isFinished: boolean;
  isDraw: boolean;
  gameStart: number;
  gameEnd: number;
}
