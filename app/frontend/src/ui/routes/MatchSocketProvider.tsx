import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useUsername } from "../../store/username";
import { openSocket, closeSocket } from "../../services/websocket";

const MatchSocketProvider = () => {
  const location = useLocation();
  const username = useUsername();

	useEffect(() => {
		const matchPath = location.pathname.match(
			/^\/(waiting|game)\/([^/]+)$/
		);

		if (!matchPath) {
			console.log("User left match");
			closeSocket();
			return;
		}

		const matchId = matchPath[2];

		console.log("User is in match:", matchId);
		openSocket(matchId, username);
	}, [location.pathname]);

	return <Outlet />;
};

export default MatchSocketProvider;
