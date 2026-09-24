import { useEffect } from "react";
import {useParams, useNavigate, useOutletContext } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import { sendMessage, getSocket } from "../../services/websocket";
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
	const { message }: any = useOutletContext();

	useEffect(() => {
		if (!matchId) {
			console.error("No matchId provided in the URL");
			return;
		}

		// const socket = getSocket();

		// if (!socket) {
		// 	console.log("[WR] no socket, returning");
		// 	return;
		// }
		if (message === null || message === undefined) {
			return;
		}
		console.log("[WR] Received:", message);
		const data = message;
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
			//navigate(`/game/${matchId}?game-mode=online&level=0&size=${data.size}`)
			navigate(`/game/${matchId}?game-mode=online&level=0&size=${data.size}`, {replace: true});
		}

		if (data.type === "game-canceled"){
			clearMatch();
			navigate("/lobby");
		}

		if (data.type === "left-match"){
			clearMatch();
			navigate("/lobby");
		}

		// if (data.type === "error") {
		// 	clearMatch();
		// 	//closeSocket();
		// 	navigate("/lobby");
		// }

		return () => {}
	}, [matchId, navigate, message]);

	const requiredPlayers = match?.requiredPlayers ?? -1;
	const connectedPlayers = match?.players.length ?? -2;

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
		console.log("[WR] Starting game request sent...");
	};

	const handleCancel = () => {
		console.log("[WR] remove the game")
		if (!matchId) return;
		sendMessage(createCancelGameMessage(matchId));
	}

	return (
	<CenteredLayout>
		<h1 className="text-3xl">WAITING ROOM</h1>
		<p>Players: {connectedPlayers}/{requiredPlayers}</p>
		<p>
			{statusMessage(connectedPlayers, requiredPlayers)}
		</p>
		{match?.host === username && (
			<>
				{connectedPlayers === requiredPlayers && (
					<PrimaryButton onClick={handlePlay}>PLAY</PrimaryButton>
				)}

				{connectedPlayers !== requiredPlayers && (
					<PrimaryButton disabled>PLAY</PrimaryButton>
				)}
			</>
		)}
		<SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
	</CenteredLayout>
	);
}

export default WaitingRoom;
