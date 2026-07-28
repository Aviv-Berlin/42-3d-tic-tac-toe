import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import gameRoutes from "./routes/gameRoutes.ts";
import cors from "cors";


const app = express();

app.use(cors({
	origin: "http://localhost:5173"
}));

app.use(express.json());

// /game-settings?game-mode=online
app.use("/v1/auth", authRoutes);

app.use("v1/game", gameRoutes);

// Suggestion:
// seperate roots for local, ai, online

// POST /v1/game/local/create
// POST /v1/game/ai/create
// GET /v1/game/online/lobby

// OR

// POST /v1/game/create?mode=local
// POST /v1/game/create?mode=ai
// GET /v1/game/online/lobby

app.listen(process.env.PORT, () => {
	  console.log(`Server running on port ${process.env.PORT}`);
});