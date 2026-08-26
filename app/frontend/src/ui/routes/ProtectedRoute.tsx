import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      await meService.getUsername();
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }
  useEffect(() => {
    checkToken();
  })
	return <Outlet />
}

export default ProtectedRoute
