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

  const gameMode = searchParams.get('game-mode'); 

  const isValid = gameMode === "online" || gameMode === "ai" || gameMode === "local";

  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  if (!isValid) return null;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 items-center">
        <div className="self-start">
          <button 
            className="border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer"
            onClick={() => navigate('/home')}
          >← Back</button>
        </div>
        <p>{`Mode: ${gameMode}`}</p>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <MainButton onClick={() => navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`)}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

export default GameSettings
