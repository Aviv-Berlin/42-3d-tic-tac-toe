import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import './Home.css'

const Home = () => {
  const [size, setSize] = useState(3);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game?size=${size}`); 
  }

  const page = "home";

  return (
    <div className={page}>
      <Navbar page={page} />
      <h1>Home</h1>
      <Slider size={size} setSize={setSize} />
      <button className="play-button" onClick={handleClick}>Play</button>
    </div>
  )
}

export default Home
