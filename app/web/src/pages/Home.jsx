import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';

const Home = () => {
  const [size, setSize] = useState(3);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game?size=${size}`);
  };

  return (
    <MainLayout page="home">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">

        <div className="flex flex-col items-center gap-2">
          <label className="text-lg font-semibold">
            Board Size: {size} × {size} × {size}
          </label>

          <input
            type="range"
            min="3"
            max="5"
            step="1"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-64"
          />

          <div className="flex justify-between w-64 text-sm">
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        <Button onClick={handleClick}>Play</Button>

      </div>
    </MainLayout>
  );
};

export default Home;