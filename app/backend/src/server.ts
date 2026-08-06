import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import authRoutes from "./routes/authRoutes.ts";
import gameRoutes from "./routes/gameRoutes.ts";
import { setupWebSocket } from "./websocket/wsServer.ts";


const app = express();

app.use(cors({
	origin: "http://localhost:5173"
}));


app.use(express.json());

app.use("/v1/auth", authRoutes);

// add middleware for token verification for game routes

app.use("/v1/game", gameRoutes);

// HTTP Server
const server = http.createServer(app);

// WebSocket Server
setupWebSocket(server);

// Start everything
server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});