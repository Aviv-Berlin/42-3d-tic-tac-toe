import statsQueries from "../database/statsQueries.ts";
import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import { GameHistory } from '../../../shared/game.ts';
import { MatchEntry } from '../database/gameQueries.ts';


async function convertToGameHistory(row: MatchEntry, id: number) {
	
	const opponent_id = row.player1 === id ? row.player2 : row.player1;
	const outcome =
		row.winner === id ? "WIN" :
		row.winner === opponent_id ? "LOSS" :
		"DRAW";
	const mode =
		opponent_id === 0 ? "ai" :
		opponent_id === 1 ? "local" :
		"online";
	const opponentUser = await userQueries.getUserByID(opponent_id);
	const summary: GameHistory = {
		opponent: opponentUser.username,
		outcome: outcome,
		gameMode: mode,
		size: row.board_size,
		//moves: null // TODO
	}
	return (summary);
}

export async function getGameHistory(request: Request, response: Response) {
	
	const id = request.userData?.id;
	if (!id) {
		return response.status(400).json({
			error: 'no user id in token'
		});
	}
	try {
		const result = await statsQueries.getUserGames(id);
		if (!result || !result.rows) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
		const all_games : GameHistory[] = [];
		for (let i = 0; i < 5; i++){
			if (!result.rows[i]){
				break;
			}
			const game: GameHistory = await convertToGameHistory(result.rows[i], id);
			all_games.push(game);
		}
		return response.status(200).json(all_games);
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

export async function getWinTotal(request: Request, response: Response) {
	const id = request.userData?.id;
	if (!id) {
		return response.status(400).json({
			error: 'no user id in token'
		});
	}
	try {
		const wins = await statsQueries.getUserWins(id);
		return response.status(200).json(wins);
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

export async function getDrawTotal(request: Request, response: Response) {
	const id = request.userData?.id;
	if (!id) {
		return response.status(400).json({
			error: 'no user id in token'
		});
	}
	try{
		const draws = await statsQueries.getUserDraws(id);
		return response.status(200).json(draws);
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

export async function getLossTotal(request: Request, response: Response) {
	const id = request.userData?.id;
	if (!id)
		return response.status(400).json({
			error: 'no user id in token'
		});
	try{
		const losses = await statsQueries.getUserLosses(id);
		return response.status(200).json(losses);
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

export default {
	getGameHistory,
	getWinTotal,
	getDrawTotal,
	getLossTotal,
	//getMoves // TODO
};
