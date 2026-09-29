import express from "express";
import stats from '../controllers/statsController.js';

const router = express.Router();

//get data of all games for user
router.get('/profile/history', stats.getGameHistory);

router.get('/profile/rank', stats.getRankData);

router.get('/profile/stats', stats.getUserStats);

export default router;
