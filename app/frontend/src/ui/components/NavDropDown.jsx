import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsername } from '../context/UsernameContext'
import { ChevronUp, ChevronDown } from 'lucide-react';
import DropDownButton from './DropDownButton'

const NavDropDown = () => {
  const [open, setOpen] = useState(false);

  const { username } = useUsername();

  return (
    <div className="relative">
      <DropDownButton onClick={() => setOpen((prev) => !prev)}>
        <p className="hidden sm:inline">{username}</p>
        { open ? <ChevronUp /> : <ChevronDown /> }
      </DropDownButton>
      <div className={`absolute right-0 flex flex-col border border-stone-400 mt-6 w-40 items-center ${open ? "visible" : "invisible"}`}>
        <Link to="/profile" className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Profile
        </Link>
        <Link to="/settings" className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Settings
        </Link>
        <Link to="/login" className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Log out
        </Link>
      </div>
    </div>
  )
}

export default NavDropDown
