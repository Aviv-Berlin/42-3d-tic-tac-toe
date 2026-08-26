import { type Request, type Response, type NextFunction } from 'express';
import userQueries from "../database/userQueries.ts";
import jwt from 'jsonwebtoken';


declare global {
	namespace Express {
	  interface Request {
		userData: {
		  id: number;
		  username: string;
		};
	  }
	}
}

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
		response.status(401).json({ error: 'missing or invalid token' })
		return;
	}
	const decodedToken = jwt.verify(token, secretKey)
	if (typeof decodedToken === `string`) {
		console.log("Error: checkToken(): invalid token");
		response.status(401).json({ error: 'missing or invalid token' })
		return;
	}
	console.log(`decoded Token id = ${decodedToken.id}`)
	if (!decodedToken.id) {
		console.log("Error: checkToken(): token contains invalid id");
		response.status(401).json({ error: 'misisng or invalid token' })
		return;
	}
	const user = await userQueries.getUserByID(decodedToken.id);
	if (!user || !user.username || !user.id) {
		response.status(401).json({ error: 'token does not correspond to a user' })
		return;
	}
	request.userData = {
		id: user.id,
		username: user.username,
	};
	next();
}
