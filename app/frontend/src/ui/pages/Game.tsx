import { useSearchParams } from 'react-router-dom';
import { useRef } from 'react';
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';
import { GameState } from '../../types/game';

const Game = () => {
  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get('size')) || 3;

  const gameStateRef = useRef<GameState>({
    player1: { type: 'real', username: '' },
    player2: { type: 'ai', username: '' },
    moves: [],
    size,
    isFinished: false,
    isDraw: false,
    winner: null,
  });

  return (
    <GameLayout>
      <Canvas gameState={gameStateRef.current}/>
    </GameLayout>
  )
}

export default Game
