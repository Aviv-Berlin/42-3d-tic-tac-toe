import userQueries from "../database/userQueries.ts";
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
export async function register(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.email || !body.password) {
		return response.status(400).json({
			error: 'registration data incomplete'
		});
	}

	try{
		const existingUsername = await userQueries.getUserIdByUsername(body.username);
		if (existingUsername) {
			return response.status(409).json({
				error: 'username already exists'
			});
		}
	
		const existingEmail = await userQueries.getUserIdByEmail(body.email);
		if (existingEmail) {
			return response.status(409).json({
				error: 'email already registered'
			});
		}
	
		const passwordHash = await bcrypt.hash(body.password, 10);
		
		const newUser = await userQueries.createUser(body.username, body.email, passwordHash);
	
		return response.status(201).json({
			username: newUser.username,
			email: newUser.email
		});
	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
	
}

// Login an existing user
export async function login(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.password) {
		return response.status(400).json({
			error: 'login data incomplete'
		});
	}

	try{
		//const user = await userQueries.getUserByUsername(body.username);
		const userID = await userQueries.getUserIdByUsername(body.username);
		if (!userID) {
			return response.status(404).json({
				error: 'username not found'
			});
		}

		const hashedPW = await userQueries.getHashedPasswordByID(userID);
		const pwMatch = await bcrypt.compare(body.password, hashedPW);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}

		const userForToken = {
			username: body.username,
			id: userID
		}

		//const token = jwt.sign(userForToken, process.env.SECRET as string, { expiresIn: '1h' });
		const token = jwt.sign(userForToken, process.env.SECRET as string);

		return response.cookie('token', token).status(200).send({
			username: body.username
		});

	}
	catch (error) {
		console.error(error);
		return response.status(500).json({
			error: 'internal server error'
		});
	}
}

export async function logout(request: Request, response: Response) {
	void request;
	console.log("logout in authController");
	return response.clearCookie('token').status(200).send({});
}

export default {
	register,
	login,
	logout
};