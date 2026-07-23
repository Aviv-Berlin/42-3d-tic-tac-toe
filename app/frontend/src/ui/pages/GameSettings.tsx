import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import GameSettingButton from '../components/GameSettingButton'
import MainLayout from '../layouts/MainLayout';

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
          <button className="border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer" onClick={() => navigate('/home')}>← Back</button>
        </div>
        <p>{`Mode: ${gameMode}`}</p>
        <h1 className="text-3xl font-serif italic">Board Size:</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <GameSettingButton selected={size === 3} onClick={() => setSize(3)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <p className="text-xs absolute bottom-2 right-2">3x3x3</p>
            </div>
          </GameSettingButton>
          <GameSettingButton selected={size === 4} onClick={() => setSize(4)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <p className="text-xs absolute bottom-2 right-2">4x4x4</p>
            </div>
          </GameSettingButton>
          <GameSettingButton selected={size === 5} onClick={() => setSize(5)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <p className="text-xs absolute bottom-2 right-2">5x5x5</p>
            </div>
          </GameSettingButton>
        </div>
        {gameMode === "ai" &&
          <>
            <h1 className="text-3xl font-serif italic">Difficulty:</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <GameSettingButton selected={level === 1} onClick={() => setLevel(1)}>
                <div className="w-full h-full relative flex justify-center items-center">
                  <p className="text-xs absolute bottom-2 right-2">easy</p>
                </div>
              </GameSettingButton>
              <GameSettingButton selected={level === 2} onClick={() => setLevel(2)}>
                <div className="w-full h-full relative flex justify-center items-center">
                  <p className="text-xs absolute bottom-2 right-2">medium</p>
                </div>
              </GameSettingButton>
              <GameSettingButton selected={level === 3} onClick={() => setLevel(3)}>
                <div className="w-full h-full relative flex justify-center items-center">
                  <p className="text-xs absolute bottom-2 right-2">hard</p>
                </div>
              </GameSettingButton>
            </div>
          </>
        }

        <MainButton onClick={() => navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`)}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

export default GameSettings
