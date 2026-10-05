import userQueries from "../database/userQueries.js";
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { readFile } from 'node:fs/promises'; // API for async file operations in Node.js

const filePath = process.env.NODE_ENV === "prod" ? '/run/secrets/jwt_secret' : path.join(import.meta.dirname, '../../../secrets/jwt_secret');
const secret = await readFile(filePath, 'utf8');

// Register a new user
export async function register(request: Request, response: Response) {
	const body = request.body;

	if (!body.username || !body.email || !body.password) {
		return response.status(400).json({
			error: 'registration data incomplete'
		});
  }

  if (body.username.length > 10) {
    return response.status(400).json({
      error: 'username too large'
    });
  }
  if (body.email.length > 64) {
    return response.status(400).json({
      error: 'email too long'
    });
  }
  if (body.password.length > 16) {
    return response.status(400).json({
      error: 'password too long'
    });
  }
  if (!(body.email.includes("@"))){
	return response.status(400).json({
      error: 'invalid email'
    });
  }
  if (body.username.includes("@")){
	return response.status(400).json({
      error: 'username contains "@"'
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

	if (!body.login || !body.password) {
		return response.status(400).json({
			error: 'login data incomplete'
		});
	}

	try{
		let userID;
		//console.log("login:", body.login)
		if (body.login.includes("@"))
			userID = await userQueries.getUserIdByEmail(body.login);
		else
			userID = await userQueries.getUserIdByUsername(body.login);
		if (!userID) {
			return response.status(404).json({
				error: 'username/email not found'
			});
		}

		const hashedPW = await userQueries.getHashedPasswordByID(userID);
		const pwMatch = await bcrypt.compare(body.password, hashedPW);
		if (!pwMatch) {
			return response.status(401).json({
				error: 'bad credentials'
			});
		}
		const username = await userQueries.getUsernameByID(userID)
		const userIDforToken = {
			id: userID
		};
		const token = jwt.sign(userIDforToken, secret as string);

		return response.cookie('token', token).status(200).send({username});

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
	//console.log("logout in authController");
	return response.clearCookie('token').status(200).send({});
}

export default {
	register,
	login,
	logout
};
