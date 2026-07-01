import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  }

  return (
    <div className="navbar">
      <button className="exit-button" onClick={handleClick}>Exit game</button>
    </div>
  )
}

export default Navbar
