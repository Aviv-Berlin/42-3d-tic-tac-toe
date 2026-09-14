import { PlayerData, GameMode } from '../../../shared/game.js';

const createPlayers = (players: string[], gameMode: GameMode): PlayerData[] => {
  const player1: PlayerData = {
    type: "real",
    username: players[0],
  }

  let player2: PlayerData;
  if (gameMode === "online") {
    player2 = {
      type: "real",
      username: players[1],
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
