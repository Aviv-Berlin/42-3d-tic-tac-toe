import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MainButton from '../components/MainButton';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get('user') || "";

  const handleClick = () => {
    navigate(`/game-settings?user=${username}`);
  };

  return (
    <MainLayout username={username}>
      <div className="flex gap-16">
        <div className="flex flex-col">
          <p className="text-xl">{`Welcome back ${username}!`}</p>
          <p className="text-4xl">Ready for a game?</p>
        </div>
        <div className="flex flex-col gap-4">
          <MainButton onClick={handleClick}>PLAY ONLINE</MainButton>
          <MainButton onClick={handleClick}>PLAY AGAINST AI</MainButton>
          <MainButton onClick={handleClick}>PLAY LOCALLY WITH A FRIEND</MainButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
