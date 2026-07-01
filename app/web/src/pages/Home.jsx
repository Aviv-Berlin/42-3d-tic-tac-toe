import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game'); 
  }

  const page = "home";

  return (
    <div className={page}>
      <Navbar page={page} />
      <h1>Home</h1>
      <button className="play-button" onClick={handleClick}>Play</button>
    </div>
  )
}

export default Home
