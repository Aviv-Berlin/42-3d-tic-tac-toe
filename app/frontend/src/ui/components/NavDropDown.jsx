import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DropDownButton from './DropDownButton'

const NavDropDown = ({username}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <DropDownButton onClick={() => setOpen((prev) => !prev)}>
        <p>{username}</p>
        { open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> }
      </DropDownButton>
      <div className={`absolute right-0 flex flex-col border border-stone-400 mt-6 w-40 items-center ${open ? "visible" : "invisible"}`}>
        <Link to={`/profile?user=${username}`} className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Profile
        </Link>
        <Link to={`/settings?user=${username}`} className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
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
