import HomeButton from './HomeButton'
import NavDropDown from './NavDropDown'

const Navbar = ({username}) => {
  return (
    <nav className="flex justify-between p-4 border-b border-stone-400">
      <HomeButton username={username} />
      <NavDropDown username={username} />
    </nav>
  )
}

export default Navbar
