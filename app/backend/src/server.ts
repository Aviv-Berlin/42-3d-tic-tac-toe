import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { GameState } from "./game/GameState.ts";
import { WsMessage } from "../../shared/messages.ts"
import { handleMessage } from "./game/socketHandlersBE.ts";

const app = express();

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
]);

app.use(cors({
    origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.has(origin));
    }
}));
// app.use(cors({
// 	origin: "http://localhost:5173"

// }));

app.use(express.json());

app.use("/v1/auth", authRoutes);

const server = http.createServer(app);

const games: GameState[] = [];

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {

	ws.on('message', (event) => {
    const message: WsMessage = JSON.parse(event.toString());
		handleMessage(message, ws, games);

	})
	//ws.send(JSON.stringify(`Hello from server.ts!`));
});

const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, '0.0.0.0', () => {
	  console.log(`Server running on port ${process.env.PORT}`);
});
