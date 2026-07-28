import { PlayerData, GameMode } from '../types/game';

const createPlayers = (username: string, gameMode: GameMode): PlayerData[] => {
  const player1: PlayerData = {
    type: "real",
    username,
  }

  let player2: PlayerData;
  if (gameMode === "online") {
    player2 = {
      type: "real",
      username: "stranger",
    }
  } else if (gameMode === "ai") {
    player2 = {
      type: "ai",
      username: "ai",
    }
  } else {
    player2 = {
      type: "guest",
      username: "guest",
    }
  }
  return [player1, player2];
}

export default createPlayers;
