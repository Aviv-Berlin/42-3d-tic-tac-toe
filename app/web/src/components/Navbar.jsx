import { useNavigate } from 'react-router-dom'

const Navbar = ({page}) => {
  const navigate = useNavigate();

  if (page === "game") {
    const handleClick = () => {
      navigate('/home');
    }

    return (
      <nav className="navbar">
        <button className="navbar-button" onClick={handleClick}>Exit game</button>
      </nav>
    )
  }

  if (page === "home") {
    const handleClick = () => {
      navigate('/login');
    }
    
    return (
      <nav className="navbar">
        <button className="navbar-button" onClick={handleClick}>Log out</button>
      </nav>
    )
  }
}

export default Navbar
