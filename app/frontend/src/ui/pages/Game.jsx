import { useSearchParams } from 'react-router-dom';
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';

const Game = () => {
  const [searchParams] = useSearchParams();

  const username = searchParams.get('user') || "";
  const size = Number(searchParams.get('size')) || 3;

  //size is read from the query parameters of the URL and then passed to the Canvas object

  const page = "game";
  
  return (
    <GameLayout username={username}>
      <Canvas size={size}/>
    </GameLayout>
  )
}

export default Game
