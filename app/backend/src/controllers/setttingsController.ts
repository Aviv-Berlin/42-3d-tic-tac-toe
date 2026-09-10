import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';

// Register a new user
export async function changeUsername(request: Request, response: Response) {
	const body = request.body;

	if (!body.newUsername || !body.oldUsername) {
		return response.status(400).json({
			error: 'data incomplete'
		});
	}

	try{
		const existingUsername = await userQueries.getUserIdByUsername(body.newUsername);
		if (existingUsername) {
			return response.status(409).json({
				error: 'username already exists'
			});
		}

		const userID = await userQueries.getUserIdByUsername(body.oldUsername);
	
		const updatedUser = await userQueries.updateUsername(body.newUsername, userID);
	
		return response.status(201).json({
			username: updatedUser.username,
		});
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
	
}

export async function changePassword(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.oldPassword || !body.newPassword) {
		return response.status(400).json({
			error: 'data incomplete'
		});
	}

	if (!request.userData || !request.userData.id || !request.userData.username) {
		return response.status(400).json({
			error: 'missing or invalid token'
		});
	}
	try{
		const hashedPW = await userQueries.getHashedPasswordByID(request.userData.id);

		const pwMatch = await bcrypt.compare(body.oldPassword, hashedPW);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		const newPwHash = await bcrypt.hash(body.newPassword, 10);
	
		const updatedUser = await userQueries.updatePassword(newPwHash, request.userData.id);
	
		return response.status(201).json({
			username: updatedUser.username,
		});
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}
export async function deleteAccount(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.password) {
		// TODO we don't need this username
		return response.status(400).json({
			error: 'data incomplete'
		});
	}
	if (!request.userData || !request.userData.id || !request.userData.username) {
		return response.status(400).json({
			error: 'missing or invalid token'
		});
	}
	try{
		const pw = await userQueries.getHashedPasswordByID(request.userData.id);
		if (!pw){
			return response.status(500).json({
				error: 'internal server error'
			});
		}
		const pwMatch = await bcrypt.compare(body.password, pw);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		const deletedUser = await userQueries.deleteUser(request.userData.id);
		await userQueries.deleteUser(request.userData.id);
	
		return response.status(201).json({
			username: deletedUser.username,
		});
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

/*
export async function deleteAccount(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.password) {
		return response.status(400).json({
			error: 'data incomplete'
		});
	}
	
	if (!request.userData || !request.userData.id || !request.userData.username) {
		return response.status(400).json({
			error: 'missing or invalid token'
		});
	}

	try{
		const pw = await userQueries.getHashedPasswordByID(request.userData.id);
		const pwMatch = await bcrypt.compare(body.password, pw);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		//const deletedUser = await userQueries.deleteUser(request.userData.id);
		await userQueries.deleteUser(request.userData.id);
	
		return response.status(201).json({
			username: deletedUser.username,
		});
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}
*/

export default {
	changeUsername,
	changePassword,
	deleteAccount
}