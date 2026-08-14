import { Link } from 'react-router-dom'
import NavDropDown from './NavDropDown'
import BabylonImage from './BabylonImage'

const Navbar = () => {
  return (
    <nav className="flex flex-col sm:flex-row items-center sm:justify-between p-4 border-b border-stone-400">
      <Link to={"/home"} className="px-4 py-2 rounded-md hover:bg-stone-200 cursor-pointer flex gap-2 items-center">
        <div className="w-8 h-8 rounded-md relative overflow-hidden">
          <BabylonImage type="three" />
        </div>
        <p className="hidden sm:inline font-bold">3D tic-tac-toe</p>
      </Link>
      <NavDropDown />
    </nav>
  )
}

export default Navbar
