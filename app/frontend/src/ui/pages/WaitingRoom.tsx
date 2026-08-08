import { useEffect, useRef, useState } from "react";
import {useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainButton from "../components/MainButton";
import { openSocket, closeSocket, sendMessage, getSocket } from "../../websocket";
import { send } from "vite";

import CenteredLayout from "../layouts/CenteredLayout"
import SecondaryButton from "../components/SecondaryButton";


interface Match {
	host: string;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started" | "disconnected" | "canceled" | "ended";
}

const WaitingRoom = () => {
	const { matchId } = useParams();
	const navigate = useNavigate();
	const [match, setMatch] = useState<Match | null>(null);

	useEffect(() => {
		if (!matchId) {
			console.error("No matchId provided in the URL");
			return;
		}

		const socket = getSocket();

		if (!socket)
			return;

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			console.log("Received:", data);

			if (data.type === "match-state") {
				setMatch({
					host: data.host,
					size: data.size,
					requiredPlayers: data.requiredPlayers,
					players: data.players,
					status: data.status
				});
			}

			if (data.type === "game-started") {
				setMatch({
					host: data.host,
					size: data.size,
					requiredPlayers: data.requiredPlayers,
					players: data.players,
					status: data.status
				});
				navigate(`/game/${matchId}?game-mode=online&level=0&size=${data.size}`);
			}

			if (data.type === "game-canceled"){
				setMatch(null);
				closeSocket();
				navigate("/lobby");
			}

			if (data.type === "left-match"){
				setMatch(null);
				closeSocket();
				navigate("/lobby");
			}

			if (data.type === "error") {
				setMatch(null);
				closeSocket();
				navigate("/lobby");
			}
			
		}

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		}
	}, [matchId, navigate]);
	
	const requiredPlayers = match?.requiredPlayers ?? 0;
	const connectedPlayers = match?.players.length ?? 0;

	const statusMessage = (connectedPlayers: number, requiredPlayers: number) => {
		if (match?.status === "canceled") 
			return "Host disconnected, please return to main menu!";
		if (connectedPlayers < requiredPlayers) 
			return "Waiting for players ...";
		if (match?.host === localStorage.getItem("username"))
			return "All players connected. Ready to start!";
		return "All players connected. Waiting for host to start the game ...";
	}

	const handlePlay = () => {
		// should be checked by server first before navigated
		//pressedPlay.current = true;
		sendMessage({
			type: "start-game",
			matchId
		});
		console.log("Starting game request sent...");
	};

	const handleCancel = () => {
		console.log("remove the game")
		sendMessage({
			type: "cancel-game",
			matchId
		}); // remove game in backend and make sure only host can cancel if player just let him leave?
		// navigate here or handleMessage after communication with server? in any case if they cancel they return to lobby 
		//navigate('/lobby')
	}

	return (
	<CenteredLayout>
		<h1 className="text-5xl font-serif italic">WAITING ROOM</h1>
		<p>Players: {connectedPlayers}/{requiredPlayers}</p>
		<p className="font-serif italic">
			{statusMessage(connectedPlayers, requiredPlayers)}
		</p>
		{match?.host === localStorage.getItem("username") && (
			<>
				{connectedPlayers === requiredPlayers && (
					<MainButton onClick={handlePlay}>PLAY</MainButton>
				)}

				{connectedPlayers !== requiredPlayers && (
					<MainButton disabled>PLAY</MainButton>
				)}
			</>
		)}
		<SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
	</CenteredLayout>
	);
}

export default WaitingRoom;