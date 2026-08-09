import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';
import { GameData, GameMode, AiLevel } from '../../../../shared/game';
import createPlayers from '../../utils/players';
import { openSocket, closeSocket, sendMessage, getSocket } from "../../websocket";
import { useUsername } from '../../store/username';
import { useGameData } from "../../store/gameData"

import { createStartGameMessage } from '../../../../shared/messages';

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

//   const socket = getSocket()
//   console.log("socket: ", socket);

  const gameData = useGameData();
  if (!gameData) return;
  console.log("Match in Game:", gameData);
  sendMessage(createStartGameMessage(gameData));

  const username = useUsername() ?? "stranger";

  const gameModeParam = searchParams.get('game-mode');
  const sizeParam = searchParams.get('size');
  const levelParam = searchParams.get('level');

  const isValid =  (
                  (gameModeParam === "online" || gameModeParam === "ai" || gameModeParam === "local") &&
                  (sizeParam === "3" || sizeParam === "4" || sizeParam === "5") &&
                  (levelParam === "0" || levelParam === "1" || levelParam === "2" || levelParam === "3")
				);

  //let initialGameData: GameData | null = null;

  if (!isValid)
	console.log("none valid value");
  if (isValid) {
    const size = Number(sizeParam);
    const gameMode = gameModeParam as GameMode;
    const level = Number(levelParam) as AiLevel;
  }
    //const [player1, player2] = createPlayers(match.players, gameMode); //const [player1, player2] = createPlayers(username, gameMode);
    //const uniqueGameName = globalThis.crypto.randomUUID();

//     initialGameData = {
//       player1, // = host
//       player2,
//       level,
//       gameMode,
//       moves: [],
//       size,
//       isFinished: false,
//       isDraw: false,
//       winner: null,
//       gameStart: 0,
//       gameEnd: 0,
//       gameID: match.id
//     };
//   }



  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

//  const gameDataRef = useRef<GameData | null>(gameData);

  //if (!isValid || !gameDataRef.current) return null;
  if (!isValid || !gameData) return null;

  return (
    <GameLayout>
      <Canvas gameData={gameData}/>
    </GameLayout>
  )
}

export default Game
