import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useUsername } from '../context/UsernameContext'
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';
import { GameData, GameMode } from '../../types/game';
import createPlayers from '../../utils/players';

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const userInfo = useUsername();
  const username = userInfo?.username ?? "stranger";
  
  const gameModeParam = searchParams.get('game-mode');
  const sizeParam = searchParams.get('size');

  const isValid = (gameModeParam === "online" || gameModeParam === "ai" || gameModeParam === "local") &&
                  (sizeParam === "3" || sizeParam === "4" || sizeParam === "5");

  let initialGameState: GameData | null = null;

  if (isValid) {
    const size = Number(sizeParam);
    const gameMode = gameModeParam as GameMode;

    const [player1, player2] = createPlayers(username, gameMode);

    initialGameState = {
      player1,
      player2,
      moves: [],
      size,
      isFinished: false,
      isDraw: false,
      winner: null,
    };
  }

  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  const gameStateRef = useRef<GameData | null>(initialGameState);

  if (!isValid || !gameStateRef.current) return null;

  return (
    <GameLayout>
      <Canvas GameData={gameStateRef.current}/>
    </GameLayout>
  )
}

export default Game
