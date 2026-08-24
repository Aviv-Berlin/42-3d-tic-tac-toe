import statsQueries from "../database/statsQueries.ts";
import { type Request, type Response } from 'express';


export async function getGameHistory(request: Request, response: Response) {
	const id = request.userData?.id;
	if (!id)
		return response.status(400).json({
			error: 'no user id in token'
		});
	try{
		const result = await statsQueries.getUserGames(id);
		if (!result || !result.rows) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
		const games = result.rows;
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
	if (!id)
		return response.status(400).json({
			error: 'no user id in token'
		});
	try{
		const wins = await statsQueries.getUserWins(id);
		if (!wins) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
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
	if (!id)
		return response.status(400).json({
			error: 'no user id in token'
		});
	try{
		const draws = await statsQueries.getUserDraws(id);
		if (!draws) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
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
		if (!losses) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
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
