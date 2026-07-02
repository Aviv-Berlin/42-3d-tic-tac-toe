import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';

const Home = () => {
  const [size, setSize] = useState(3);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game?size=${size}`); 
  }

  const page = "home";

  return (
    <MainLayout page={page}>
      <div className="flex-1 flex justify-center items-center">
        <Button onClick={handleClick}>Play</Button>
      </div>
    </MainLayout>
  )
}

export default Home
