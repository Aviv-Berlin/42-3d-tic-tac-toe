import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"
import { useSetUsername } from '../../store/username';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const setUsername = useSetUsername();
  const [retrieved, setRetrieved] = useState(false);

  const checkToken = async () => {
    try {
      const response = await meService.getUsername();
	  if (response.data.username) {
		console.log("response.data.username = ", response.data.username)
      	setUsername(response.data.username);
      	setRetrieved(true);
	  }
	  else {
	  	setRetrieved(false);
		console.log("Got redirect")
		navigate("/login")
	  }
    } catch (err) {
      setRetrieved(false);
      console.log(err);
      navigate("/login");
    }
  }
  useEffect(() => {
    checkToken();
  }, [])

  if (retrieved) return <Outlet />
  return null;
}

export default ProtectedRoute
