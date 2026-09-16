import "dotenv/config";
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import statsRoutes from './routes/statsRoutes.js';
import { setupWebSocket } from "./websocket/wsServer.js";
import { checkToken } from "./controllers/middleware.js";

//import { WebSocketServer } from "ws";
//import { GameState } from "./game/GameState.js";
//import { WsMessage } from "../../shared/messages.js"
//import { handleMessage } from "./game/socketHandlersBE.js";

const app = express();

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
]);

app.use(cookieParser());

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

// add middleware for token verification for game routes

app.use("/v1/game", checkToken, gameRoutes);
app.use("/v1/settings", checkToken, settingsRoutes);
app.use("/v1/stats", checkToken, statsRoutes);
app.use("/v1/me", checkToken, (req, res) => res.json({username: req.userData.username}));

// HTTP Server
const server = http.createServer(app);

// WebSocket Server
setupWebSocket(server);

// Start everything
server.listen(process.env.PORT, () => {
	console.log(`[SERVER] Server running on port ${process.env.PORT}`);
});

// CHECKOUT DIFF!!!

// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {

// 	ws.on('message', (event) => {
//     const message: WsMessage = JSON.parse(event.toString());
// 		handleMessage(message, ws, games);
//     	console.log(`Got `);

// 	})
//     ws.on("close", ()=> {
//         console.log("Player disconnected");
//         for (const game of games) {
//             game.handleDisconnect(ws);
//         }
//     });
// >>>>>>> websockets-main-integration
// });

// ==============================================


// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {

// 	ws.on('message', (event) => {
//     const message: WsMessage = JSON.parse(event.toString());
// 		handleMessage(message, ws, games);
//     	console.log(`Got `);

// 	})
// 	//ws.send(JSON.stringify(`Hello from server.js!`));
// });

// const PORT = Number(process.env.PORT) || 3001;

// server.listen(PORT, '0.0.0.0', () => {
// 	  console.log(`Server running on port ${process.env.PORT}`);
// });
