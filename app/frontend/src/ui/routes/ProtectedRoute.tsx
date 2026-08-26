import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const response = await meService.getUsername();
      console.log(response.data);
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
