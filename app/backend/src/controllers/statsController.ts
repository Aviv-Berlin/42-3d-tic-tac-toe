import statsQueries from "../database/statsQueries.ts";
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
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


export default {
	getGameHistory,

};
