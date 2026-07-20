import { useSearchParams } from 'react-router-dom';
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';

const Game = () => {
  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get('size')) || 3;

  return (
    <GameLayout>
      <Canvas size={size}/>
    </GameLayout>
  )
}

export default Game
