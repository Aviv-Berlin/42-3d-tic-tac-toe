import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"
import { useSetUsername, useUsername } from '../../store/username';

const ProtectedRoute = () => {
  
  const navigate = useNavigate();
  const setUsername = useSetUsername();
  const currentDisplayName = useUsername();
  const [retrieved, setRetrieved] = useState(false);
  const setDisplayName = async () => {
    if (currentDisplayName !== '') {
      setRetrieved(true);
    }
    else {
      try {
        const response = await meService.getUsername();
        setUsername(response.data.username);
        setRetrieved(true);
      } catch (err) {
        setRetrieved(false);
        console.log(err);
        navigate("/login");
      }
    }
  }
  useEffect(() => {
    setDisplayName();
  }, [currentDisplayName])
  if (retrieved) return <Outlet />
  return null;
}

export default ProtectedRoute
