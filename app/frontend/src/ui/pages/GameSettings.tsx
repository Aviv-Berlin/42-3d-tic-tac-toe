import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import MainLayout from '../layouts/MainLayout';
import BoardSizeSettings from '../components/BoardSizeSettings'
import DifficultySettings from '../components/DifficultySettings'

const GameSettings = () => {
  const [size, setSize] = useState(3);
  const [level, setLevel] = useState(0);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  let gameMode = searchParams.get('game-mode');

  const isValid = gameMode === "online" || gameMode === "ai" || gameMode === "local";

  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  if (!isValid) return null;

  if (gameMode === "ai") gameMode = "AI";
  else if (gameMode) gameMode = gameMode[0].toUpperCase() + gameMode.slice(1);

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-16 items-center">
        <div className="relative flex w-full justify-center items-center">
          <button
            className="absolute left-0 border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer"
            onClick={() => navigate('/home')}
          >← Back</button>
          <h1 className="text-xl">Mode: <span className="font-serif italic">{gameMode}</span></h1>
        </div>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "AI" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <MainButton onClick={() => navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`)}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

export default GameSettings
