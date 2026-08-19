
let socket: WebSocket | null = null;
let currentMatchId: string | null = null;

export function openSocket(matchId: string, username: string): WebSocket {
	if (socket && socket.readyState !== WebSocket.CLOSED && currentMatchId === matchId)
		return socket;

	//const username = localStorage.getItem("username");

	console.log("username: ", username);
	console.log("matchId:", matchId);

	const loc = window.location;
	var uri;
	if (loc.protocol === "https:") {
 	   uri = "wss:";
	} else {
 	   uri = "ws:";
	}
	uri += "//" + loc.host;
	uri += `/ws/v1/game/${matchId}?username=${username}`;
	socket = new WebSocket(uri);

	currentMatchId = matchId;

	socket.onopen = () => {
		console.log("WebSocket connected");
	}

	socket.onerror = (error) => {
		console.error("WebSocket error: ", error);
	}

	socket.onclose = () => {
		console.log("Websocket disconnected");
		socket = null;
		currentMatchId = null;
	}

	return socket;
}

export function sendMessage(message: unknown){
	if (socket?.readyState === WebSocket.OPEN){
		socket.send(JSON.stringify(message));
	}
}

export function getSocket(): WebSocket | null {
	return socket;
}

export function closeSocket() {
	if (socket){
		socket.close();
		socket = null;
		currentMatchId = null;
	}
}

// export const MatchSocketProvider = () => {
// 	const { matchId } = useParams();
// 	const location = useLocation();

// 	useEffect(() => {
// 		if (!matchId) return;

// 		console.log("MatchSocketProvider mounted: ", matchId)

// 		openSocket(matchId);

// 	}, [matchId])

// 	useEffect(() => {
// 		if (!matchId) return;

// 		const insideMatch =
// 			location.pathname === `/waiting/${matchId}` ||
// 			location.pathname === `/game/${matchId}`;

// 		if (!insideMatch) {
// 			console.log("User left match, closing socket");
// 			closeSocket();
// 		}
// 	}, [location.pathname, matchId]);

// 	return <Outlet />;
// }
