import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"
import { useSetUsername } from '../../store/username';

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const checkToken = async () => {
    const setUsername = useSetUsername();
    try {
      const response = await meService.getUsername();
      setUsername(response.data.username);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }
  useEffect(() => {
    checkToken();
  }, [])
	return <Outlet />
}

export default ProtectedRoute
