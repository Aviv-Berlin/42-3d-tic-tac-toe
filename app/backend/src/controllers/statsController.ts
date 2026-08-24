import statsQueries from "../database/statsQueries.ts";
import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import { GameData, Move, PlayerData, GameSummary } from '../../../shared/game.ts';
import { MatchEntry } from '../database/gameQueries.ts';

/*
function convertToGameData(rows: MatchEntry[]): GameData[] {

	const all_games : GameData[] = [];
	for (let i = 0; i < 5; i++){
		if (!rows[i]){
			break;
		}
		// TEMPORARY DUMMY VALUES / WORK IN PROGRESS
		// properly translating database query results into GameData is
		// do-able but will require a lot of code. Should be separate PR.
		const game : GameData = {
			player1: { type: "real", username: `Player #${rows[i].player1}`},
			player2: { type: "real", username: `Player #${rows[i].player2}`},
			level: 0,
			gameMode: "online",
			winner: { type: "real", username: `Player #${rows[i].player1}`},
			moves: [],
			size: 3,
			isFinished: true,
			isDraw: true,
			gameStart: 2038,
			gameEnd: 256,
			gameID: "fake_game_id",
			endMessage: null
		}
		all_games.push(game);
	}
	return (all_games);
}
*/

function convertToGameSummary(row: MatchEntry, id: number): GameSummary[] {

	const opponent_id = row.player1 === id ? row.player2 : row.player1;
	const outcome =
		row.winner === id ? "WIN" :
		row.winner === opponent_id ? "LOSS" :
		"DRAW";
	const mode =
		opponent_id === 0 ? "ai" :
		opponent_id === 1 ? "local" :
		"online";
	const summary: GameSummary = {
		opponent: userQueries.getUserByID(opponent_id),
		outcome: outcome,
		gameMode: mode;
		size: row.board_size;
		moves: null; // TODO
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
		const all_games : GameSummary[] = [];
		for (let i = 0; i < 5; i++){
			if (!result.rows[i]){
				break;
			const game: GameSummary = convertToGameSummary(result.rows);
			all_games.push(game);
		}
	}
		return response.status(200).json(games);
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
