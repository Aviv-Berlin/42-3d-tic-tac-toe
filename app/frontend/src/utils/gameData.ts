import { GameData } from "../types/game";

export const getGameEndMessage = (gameData: GameData, username: string): string => {
  if (gameData?.isDraw) return "DRAW";
  else if (gameData?.winner?.username === username) return "WIN";
  else return "LOSS";
}
