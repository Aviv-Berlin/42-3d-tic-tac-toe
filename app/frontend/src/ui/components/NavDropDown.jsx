import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavbarButton from './NavbarButton'
import DropDownButton from './DropDownButton'

const NavDropDown = ({username}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <NavbarButton onClick={() => setOpen((prev) => !prev)}>
        <p>{username}</p>
        { open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> }
      </NavbarButton>
      <div className={`absolute right-0 flex flex-col border border-stone-400 mt-6 w-40 items-center ${open ? "visible" : "invisible"}`}>
        <DropDownButton path={`/profile?user=${username}`}> 
          Profile
        </DropDownButton>
        <DropDownButton path={`/settings?user=${username}`}>
          Settings
        </DropDownButton>
        <DropDownButton path={'/login'}>
          Log out
        </DropDownButton>
      </div>
    </div>
  )
}

export default NavDropDown
