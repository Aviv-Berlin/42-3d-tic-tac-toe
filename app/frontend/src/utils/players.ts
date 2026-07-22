import { Player, GameMode } from '../types/game';

const createPlayers = (username: string, gameMode: GameMode): Player[] => {
  const player1: Player = {
    type: "real",
    username,
  }

  let player2: Player;
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
