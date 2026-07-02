import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Canvas from '../components/Canvas';

const Game = () => {
  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get('size')) || 3;

  //size is read from the query parameters of the URL and then passed to the Canvas object

  const page = "game";
  
  return (
    <MainLayout page={page}>
      <Canvas size={size}/>
    </MainLayout>
  )
}

export default Game
