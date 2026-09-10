import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useUsername } from "../../store/username";
import { openSocket, closeSocket } from "../../services/websocket";

const MatchSocketProvider = () => {
  const location = useLocation();
  const username = useUsername();
  const navigate = useNavigate();

	useEffect(() => {
		const matchPath = location.pathname.match(
			/^\/(waiting|game)\/([^/]+)$/
		);

		if (!matchPath) {
			console.log("[PROVIDER] User left match");
			closeSocket();
			return;
		}

		const matchId = matchPath[2];

		const ws = openSocket(matchId, username);

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);

			console.log("[PROVIDER] Received:", data);
			if (data.type === "error" && data.message === "Game already open in another tab"){
				closeSocket();
				navigate("/game-already-open");
			}
			else if (data.type === "error"){
				closeSocket();
				navigate("/not-found");
			}
		}

		ws.addEventListener("message", handleMessage);

		return () => {
			ws.removeEventListener("message", handleMessage);
		};

	}, [location.pathname, navigate]);

	return <Outlet />;
};

export default MatchSocketProvider;
