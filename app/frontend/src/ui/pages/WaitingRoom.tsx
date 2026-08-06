import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router-dom";
import { openSocket, closeSocket, sendMessage } from "../../websocket";
import { send } from "vite";


interface Match {
	host: string;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started" | "disconnected" | "canceled" | "ended";
}


const Game = () => {
	const { matchId } = useParams();
	const navigate = useNavigate();
	const [match, setMatch] = useState<Match | null>(null);

	useEffect(() => {
		if (!matchId) {
			console.error("No matchId provided in the URL");
			return;
		}

		const socket = openSocket(matchId);

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
		return "All players connected. Ready to start!";
	}

	const handleStart = () => {
		// should be checked by server first before navigated
		sendMessage({
			type: "start-game",
			matchId
		});
		console.log("Starting game request sent...");
	};

	return (
	<MainLayout>
		<div className="flex flex-col items-center gap-8">

			<h1 className="text-3xl font-serif italic">
				Waiting Room
			</h1>

			<p>Match ID: {matchId}</p>

			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl">
					Players: {connectedPlayers} / {requiredPlayers}
				</h2>

				<p className="font-serif italic">
					{statusMessage(connectedPlayers, requiredPlayers)}
				</p>
			</div>

			{connectedPlayers < requiredPlayers ? (
				<MainButton disabled>
					Start Game
				</MainButton>
			) : (
				<MainButton onClick={handleStart}>
					Start Game
				</MainButton>
			)}

		</div>
	</MainLayout>
);
}

export default Game;