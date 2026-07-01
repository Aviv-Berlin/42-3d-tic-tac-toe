import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Canvas from '../components/Canvas';
import './Game.css';

const Game = () => {
  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get('size')) || 3;

  //size is read from the query parameters of the URL and then passed to the Canvas object

  const page = "game";
  return (
    <div className={page}>
      <Navbar page={page} />
      <Canvas size={size}/>
    </div>
  )
}

export default Game
