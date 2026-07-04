import { useNavigate } from 'react-router-dom'
import NavbarButton from './NavbarButton'

const Navbar = ({username}) => {
  const navigate = useNavigate();
    
  return (
    <nav className="flex justify-between p-4 border-b border-stone-400">
      <NavbarButton onClick={() => navigate(`/home?user=${username}`)}>
        <img src="/logo.png" className="w-6 h-auto"/>
        <p>3D tic-tac-toe</p>
      </NavbarButton>
      <NavbarButton onClick={() => navigate('/profile')} border="no">{username}</NavbarButton> 
    </nav>
  )
}

export default Navbar
