import { GameData } from "../types/game";

export const getGameEndMessage = (gameData: GameData, username: string): string => {
  if (gameData?.isDraw) return "IT'S A DRAW";
  else if (gameData?.winner?.username === username) return "YOU WIN";
  else return "YOU LOSE";
}
