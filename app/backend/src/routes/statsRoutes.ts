import express from "express";
import stats from '../controllers/statsController.ts';

const router = express.Router();

//get data of all games for user
router.get('/profile/history', stats.getGameHistory);

//get list of moves for a game
router.post('/game-moves', stats.getMoves);

export default router;
