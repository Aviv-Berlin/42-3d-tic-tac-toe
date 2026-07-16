import { Link } from 'react-router-dom'
import NavDropDown from './NavDropDown'

const Navbar = () => {
  return (
    <nav className="flex justify-between p-4 border-b border-stone-400">
      <Link to={"/home"} className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2">
        <img src="/logo.png" className="w-6 h-auto"/>
        <p className="hidden sm:inline">3D tic-tac-toe</p>
      </Link>
      <NavDropDown />
    </nav>
  )
}

export default Navbar
