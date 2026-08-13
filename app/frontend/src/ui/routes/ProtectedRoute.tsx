import { Navigate, Outlet } from 'react-router-dom'
import jwt from 'jsonwebtoken';

const ProtectedRoute = () => {
	const token = window.localStorage.getItem('token')
	const user	= 
	if (!token) {
  	  return <Navigate to="/login" replace />
  	}
 	const url = "/v1/auth/verifyToken";
	return axios.post(url, token)
  
	return <Outlet />
}

export default ProtectedRoute
