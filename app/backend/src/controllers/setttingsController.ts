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
		const existingUsername = await userQueries.getUserByUsername(body.newUsername);
		if (existingUsername) {
			return response.status(409).json({
				error: 'username already exists'
			});
		}

		const user = await userQueries.getUserByUsername(body.oldUsername);
	
		const updatedUser = await userQueries.updateUser(body.newUsername, user.email, user.pw_hash, user.id);
	
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

	try{
		const user = await userQueries.getUserByUsername(body.username);

		const pwMatch = await bcrypt.compare(body.oldPassword, user.pw_hash);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		const newPwHash = await bcrypt.hash(body.newPassword, 10);
	
		const updatedUser = await userQueries.updateUser(body.username, user.email, newPwHash, user.id);
	
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
		return response.status(400).json({
			error: 'data incomplete'
		});
	}

	try{
		const user = await userQueries.getUserByUsername(body.username);

		const pwMatch = await bcrypt.compare(body.password, user.pw_hash);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		const deletedUser = await userQueries.deleteUser(user.id);
	
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

export default {
	changeUsername,
	changePassword,
	deleteAccount
}