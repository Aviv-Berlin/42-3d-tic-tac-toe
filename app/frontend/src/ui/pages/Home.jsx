import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MainButton from '../components/MainButton';

const Home = () => {
  const [size, setSize] = useState(3);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game?user=${username}&size=${size}`);
  };

  const username = searchParams.get('user') || "";

  return (
    <MainLayout username={username}>
      <div className="flex justify-between items-center py-60 px-60">
        <div className="flex flex-col">
          <p className="text-xl">{`Welcome back ${username}!`}</p>
          <p className="text-4xl">Ready for a game?</p>
        </div>
      <MainButton onClick={handleClick}>PLAY NOW</MainButton>
      </div>
    </MainLayout>
  );
};

export default Home;
