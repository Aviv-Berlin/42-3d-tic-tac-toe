import statsQueries from "../database/statsQueries.ts";
import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import { GameHistory, PlayerData } from '../../../shared/game.ts';
import { MatchEntry } from '../database/gameQueries.ts';
import { GameData, Move } from '../../../shared/game.ts';
import { GridPosition, CellState } from '../../../shared/game/Types.ts';

async function createGameData(row: MatchEntry, id: number) {

	const user_id = row.player1 === id ? row.player1 : row.player2;
	const opponent_id = row.player1 === id ? row.player2 : row.player1;

	const user = await userQueries.getUserByID(user_id);
	const opponent = await userQueries.getUserByID(opponent_id);
	const player1 : PlayerData = {
		type: "real",
		username: user.username
	};
	const player2 : PlayerData = {
		type: opponent.username === "ai" ? "ai" : opponent.username === "local" ? "guest" : "real",
		username: opponent.username
	};
	const level = 0;
	const gameMode = opponent.username === "ai" ? "ai" : opponent.username === "local" ? "local" : "online";
	const winner = user_id === row.winner ? player1 : opponent_id === row.winner ? player2 : null;
	const size = row.board_size;
	const isFinished = true;
	const isDraw = row.winner === null ? true : false;
	const gameStart = row.started_at.getTime();
	const gameEnd = row.ended_at.getTime();
	const gameID = row.id.toString();
	const endMessage = isDraw ? "Draw" : winner ? `${winner.username} won` : null;

	const moves = await statsQueries.getMatchReplay(row.id);
	let mv : Move[] = [];
	for (let i = 0; i < moves.rows.length; i++) {
		let pos : GridPosition = {
			x: moves.rows[i].coord_x,
			y: moves.rows[i].coord_y,
			z: moves.rows[i].coord_z
		};
		let player : CellState = moves.rows[i].player === user_id ? CellState.Player1 : CellState.Player2;
		let time : Date = moves.rows[i].played_at;
		mv.push({
			pos: pos,
			player: player,
			time: time
		});
	}

	const summary: GameData = {
		player1: player1,
		player2: player2,
		level: level,
		gameMode: gameMode,
		winner: winner,
		moves: mv,
		size: size,
		isFinished: isFinished,
		isDraw: isDraw,
		gameStart: gameStart,
		gameEnd: gameEnd,
		gameID: gameID,
		endMessage: endMessage
	}
	return (summary);
}
async function convertToGameHistory(gameData: GameData) {
	
	const outcome =
		gameData.winner === null ? "DRAW" :
		gameData.winner === gameData.player2 ? "LOSS" :
		"WIN";
	const summary: GameHistory = {
		opponent: gameData.player2.username,
		outcome: outcome,
		gameMode: gameData.gameMode,
		size: gameData.size,
		gameData: gameData
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
		const result = await statsQueries.getRecentGames(id, 5);
		if (!result || !result.rows) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}

		const recent_games : GameHistory[] = [];
		for (let i = 0; i < 5; i++){
			if (!result.rows[i]){
				break;
			}
			const game: GameData = await createGameData(result.rows[i], id);
			const history: GameHistory = await convertToGameHistory(game);
			recent_games.push(history);
		}
		return response.status(200).json(recent_games);
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
