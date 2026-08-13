import { useEffect } from "react";
import {useParams, useNavigate } from "react-router-dom";
import MainButton from "../components/MainButton";
import { closeSocket, sendMessage, getSocket } from "../../websocket";
import { useMatch, useSetMatch, useClearMatch } from "../../store/matchData"
import { useSetGameData } from "../../store/gameData";

import CenteredLayout from "../layouts/CenteredLayout"
import SecondaryButton from "../components/SecondaryButton";
import { createCancelGameMessage, createPlayGameMessage } from "../../../../shared/messages";
import { useUsername } from '../../store/username'

const WaitingRoom = () => {
	const { matchId } = useParams();
	const navigate = useNavigate();
	const match = useMatch();
	const setMatch = useSetMatch();
	const setGameData = useSetGameData();
	const clearMatch = useClearMatch();
	const username = useUsername();

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
					id: matchId,
					host: data.host,
					mode: data.mode,
					level: data.level,
					size: data.size,
					requiredPlayers: data.requiredPlayers,
					players: data.players,
					status: data.status
				});
			}

			if (data.type === "game-init") {
				setMatch({
					id: matchId,
					host: data.host,
					mode: data.mode,
					level: data.level,
					size: data.size,
					requiredPlayers: data.requiredPlayers,
					players: data.players,
					status: data.status
				});
				setGameData(data.gameData);
				navigate(`/game/${matchId}?game-mode=online&level=0&size=${data.size}`);
			}

			if (data.type === "game-canceled"){
				clearMatch();
				closeSocket();
				navigate("/lobby");
			}

			if (data.type === "left-match"){
				clearMatch();
				closeSocket();
				navigate("/lobby");
			}

			if (data.type === "error") {
				clearMatch();
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
		if (match?.host === username)
			return "All players connected. Ready to start!";
		return "All players connected. Waiting for host to start the game ...";
	}

	const handlePlay = () => {
		if (!matchId) return;
		sendMessage(createPlayGameMessage(matchId));
		console.log("Starting game request sent...");
	};

	const handleCancel = () => {
		console.log("remove the game")
		if (!matchId) return;
		sendMessage(createCancelGameMessage(matchId));
	}

	return (
	<CenteredLayout>
		<h1 className="text-5xl font-serif italic">WAITING ROOM</h1>
		<p>Players: {connectedPlayers}/{requiredPlayers}</p>
		<p className="font-serif italic">
			{statusMessage(connectedPlayers, requiredPlayers)}
		</p>
		{match?.host === username && (
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
