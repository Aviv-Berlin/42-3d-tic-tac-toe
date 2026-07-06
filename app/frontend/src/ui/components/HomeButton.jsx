import { useNavigate } from 'react-router-dom'
import NavbarButton from './NavbarButton'

const HomeButton = ({username}) => {
  const navigate = useNavigate();

  return (
    <NavbarButton onClick={() => navigate(`/home?user=${username}`)}>
      <img src="/logo.png" className="w-6 h-auto"/>
      <p>3D tic-tac-toe</p>
    </NavbarButton>
  )
}

export default HomeButton
