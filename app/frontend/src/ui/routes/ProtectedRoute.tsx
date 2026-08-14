import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = () => {
	/*
	const token = window.localStorage.getItem('token')
	if (!token) {
  	  return <Navigate to="/login" replace />
  	}
*/

  //  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 //	const url = "/v1/auth/verifyToken";
//	return axios.post(url, token)
  
	return <Outlet />
}

export default ProtectedRoute
