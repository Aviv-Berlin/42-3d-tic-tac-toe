import { GameData } from "../../../shared/game";

export const getGameEndMessage = (gameData: GameData, username: string): string => {
  if (gameData.endMessage)
      return gameData.endMessage;
  if (gameData?.isDraw) return "DRAW";
  else if (gameData?.winner?.username === username) return "WIN";
  else return "LOSS";
}
