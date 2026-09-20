import { type Request, type Response, type NextFunction } from 'express';
import userQueries from "../database/userQueries.js";
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET
if (!secret){
	throw new Error("Missing SECRET");
}
const secretKey: string = secret;

const getTokenFrom = (request: Request) => {
	const cookie = request.cookies;
	if (!cookie){
		console.log('getTokenFrom... !cookies')
		return null
	}
	const token_cookie = cookie['token']
	return (token_cookie)
}

export const checkToken = async (request: Request, response: Response, next: NextFunction) => {
	const token = getTokenFrom(request)
	if (!token) {
		console.log("Error: checkToken(): missing token");
		response.clearCookie('token').status(401).json({ error: 'missing or invalid token' })
		return;
	}
<<<<<<< HEAD
	let decodedToken;
=======
	let	decodedToken;
>>>>>>> main
	try {
		decodedToken = jwt.verify(token, secretKey)
	}
	catch {
		console.log("Error: jwt could not verify token, maybe due to it being malformed");
<<<<<<< HEAD
		response.clearCookie('token').status(401).json({ error: 'missing or invalid token' })
=======
		response.clearCookie('token').status(401).json({error: 'missing or invalid token'})
>>>>>>> main
		return;
	}
	if (typeof decodedToken === `string`) {
		console.log("Error: checkToken(): invalid token");
		response.clearCookie('token').status(401).json({ error: 'missing or invalid token' })
		return;
	}
	console.log(`decoded Token id = ${decodedToken.id}`);
	if (!decodedToken.id) {
		console.log("Error: checkToken(): token contains invalid id");
		response.clearCookie('token').status(401).json({ error: 'missing or invalid token' })
		return;
	}
	const username = await userQueries.getUsernameByID(decodedToken.id);
	if (!username) {
		response.clearCookie('token').status(401).json({ error: 'token does not correspond to a user' })
		return;
	}
	request.userData = {
		id: decodedToken.id,
		username: username,
	};
	next();
}
