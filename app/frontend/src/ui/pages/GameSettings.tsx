import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import SecondaryButton from '../components/SecondaryButton'
import MainLayout from '../layouts/MainLayout';
import BoardSizeSettings from '../components/BoardSizeSettings'
import DifficultySettings from '../components/DifficultySettings'
import { normalizeGameMode } from '../../utils/gameMode';

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

  const gameModeDisplay = normalizeGameMode(gameMode);

  const handleConfirm = () => {
    if (gameMode === "online") {
      navigate('/waiting-room?size=${size}')
    } else {
      navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`)
    }
  }

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-16 items-center">
        <div className="relative flex w-full justify-center items-center">
          <div className="absolute left-0">
            <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
          </div>
          <h1 className="text-xl">Mode: <span className="font-serif italic">{gameModeDisplay}</span></h1>
        </div>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <MainButton onClick={handleConfirm}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

export default GameSettings
