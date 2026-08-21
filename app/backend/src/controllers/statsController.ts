import statsQueries from "../database/statsQueries.ts";
import { type Request, type Response } from 'express';


export async function getGameHistory(request: Request, response: Response) {
	const id = request.userData?.id;
	if (!id)
		return response.status(400).json({
			error: 'no user id in token'
		});
	try{
		const games = await statsQueries.getUserGames(id);
		if (!games) {
			return response.status(400).json({
				error: 'invalid user id'
			});
		}
		return games;
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
		return wins;
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
		return draws;
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
		return losses;
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

};
