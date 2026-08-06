import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsername } from '../context/UsernameContext'
import { ChevronUp, ChevronDown } from 'lucide-react';
import DropDownButton from './DropDownButton'

const NavDropDown = () => {
  const [open, setOpen] = useState(false);

  const DropDownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const userInfo = useUsername();
  if (!userInfo) return null;

  const { username } = userInfo;

  const handleLogOut = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    navigate('/login');
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (DropDownRef.current && !DropDownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open])

  return (
    <div ref={DropDownRef} className="relative">
      <DropDownButton onClick={() => setOpen((prev) => !prev)}>
        <p className="hidden sm:inline">{username}</p>
        { open ? <ChevronUp /> : <ChevronDown /> }
      </DropDownButton>
      <div className={`absolute right-0 flex flex-col bg-white border rounded-md border-stone-400 mt-6 w-40 items-center ${open ? "visible" : "invisible"}`}>
        <Link to="/profile" className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Profile
        </Link>
        <Link to="/settings" className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Settings
        </Link>
        <button onClick={handleLogOut} className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2 w-full justify-center">
          Log out
        </button>
      </div>
    </div>
  )
}

export default NavDropDown
