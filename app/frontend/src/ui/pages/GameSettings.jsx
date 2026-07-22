import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import BoardSizeButton from '../components/BoardSizeButton'
import MainLayout from '../layouts/MainLayout';

const GameSettings = () => {
  const [size, setSize] = useState(3) 
  const navigate = useNavigate();
 
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl">Choose board size</h1>
        <div className="flex gap-4">
          <BoardSizeButton selected={size === 3} onClick={() => setSize(3)}>3x3x3</BoardSizeButton>
          <BoardSizeButton selected={size === 4} onClick={() => setSize(4)}>4x4x4</BoardSizeButton>
          <BoardSizeButton selected={size === 5} onClick={() => setSize(5)}>5x5x5</BoardSizeButton>
        </div>
        <MainButton onClick={() => navigate(`/game?size=${size}`)}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

export default GameSettings
