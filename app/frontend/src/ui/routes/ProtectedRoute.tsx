import { Navigate, Outlet } from 'react-router-dom'
import { useUsername } from '../../store/username'

const ProtectedRoute = () => {
  const username = useUsername();
	if (!username) {
  	  return <Navigate to="/login" replace />
  	}
	return <Outlet />
}

export default ProtectedRoute
