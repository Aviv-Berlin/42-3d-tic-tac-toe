import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { GameState } from "../../shared/game/GameState.ts";
import { WsMessage } from "../../shared/messages.ts"

const app = express();

app.use(cors({
	origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/v1/auth", authRoutes);

const server = http.createServer(app);

const games: GameState[] = [];

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {

	ws.on('message', (message: WsMessage) => {
		console.log(`Received message: ${message}`);
		switch (message.type) {
			case "join-game":
				const data = message.payload;
				// games.push(new GameState(data.gameData, 2))
				break;
			case "move":
				break;
			default:
				console.log(`Unknown messaage: ${message}`);
		}
	})

	ws.send(JSON.stringify(`Hello from server.ts!`));
});

app.listen(process.env.PORT, () => {
	  console.log(`Server running on port ${process.env.PORT}`);
});
