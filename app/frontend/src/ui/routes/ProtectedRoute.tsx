import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = () => {
	const loggedIn = window.localStorage.getItem('username')
	if (!loggedIn) {
  	  return <Navigate to="/login" replace />
  	}
	return <Outlet />
}

export default ProtectedRoute
