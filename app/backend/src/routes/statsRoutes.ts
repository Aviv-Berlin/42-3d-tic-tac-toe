import express from "express";
import stats from '../controllers/statsController.ts';

const router = express.Router();

//get data of all games for user
router.get('/profile/history', stats.getGameHistory);

router.get('/profile/wins', stats.getWinTotal);

router.get('/profile/draws', stats.getDrawTotal);

router.get('/profile/losses', stats.getLossTotal);

//get list of moves for a game
// router.post('/game-moves', stats.getMoves);
// TODO

export default router;
