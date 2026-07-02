import { useNavigate } from 'react-router-dom'
import Button from './Button'

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
  } else if (page == "profile") {
    buttons = 
    [
      {
        name: "Home",
        handler: () => navigate('/home'),
      },
      {
        name: "Log out",
        handler: () => navigate('/login'),
      },
    ]
  }
    
  return (
    <nav className="flex justify-between p-4 border-b border-stone-400">
      {buttons.map((b) => (
        <Button key={b.name} onClick={b.handler} border="no">{b.name}</Button>
      ))}
    </nav>
  )
}

export default Navbar
