import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({page}) => {
  const navigate = useNavigate();
  let buttons;

  if (page === "game") {
    buttons = 
    [
      {
        name: "Profile",
        handler: () => navigate('/profile'),
      },
      {
        name: "Exit game",
        handler: () => navigate('/home'),
      },
    ]
  } else if (page == "home") {
    buttons = 
    [
      {
        name: "Profile",
        handler: () => navigate('/profile'),
      },
      {
        name: "Log out",
        handler: () => navigate('/login'),
      },
    ]
  }
  return (
    <nav className="navbar">
      {buttons.map((b) => (
        <button key={b.name} className="navbar-button" onClick={b.handler}>{b.name}</button>
      ))}
    </nav>
  )
}

export default Navbar
