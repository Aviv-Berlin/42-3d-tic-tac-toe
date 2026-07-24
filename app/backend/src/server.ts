import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import cors from "cors";


const app = express();

app.use(cors({
	origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
	  console.log(`Server running on port ${process.env.PORT}`);
});