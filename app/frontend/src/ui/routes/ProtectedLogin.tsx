import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import meService from "../../services/me"

const ProtectedLogin = () => {
  const navigate = useNavigate();
  const [retrieved, setRetrieved] = useState(true);

  const checkToken = async () => {
	try {
		const response = await meService.getUsername();
		if (response.data.username) {
			setRetrieved(true);
			navigate("/home");
		}
		else {
			setRetrieved(false);
		}
	} catch (err) {
	  	setRetrieved(false);
 	   }
	}
	useEffect(() => {
		checkToken();
	}, [])

  if (!retrieved) return <Outlet />
  return null;
}

export default ProtectedLogin
