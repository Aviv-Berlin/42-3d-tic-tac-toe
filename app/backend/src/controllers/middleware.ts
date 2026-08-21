import { type Request, type Response, type NextFunction } from 'express';
import userQueries from "../database/userQueries.ts";
import jwt from 'jsonwebtoken';

/*
declare global {
	namespace Express {
	  interface Request {
		//userData: {
		//  id: number;
		//  id_str: string;
		//};
		userData: {
		  id: number;
		  username: string;
		};
	  }
	}
  }
*/

export interface ValidatedRequest extends Request {
	userData: {
	  id: number;
	  username: string;
	};
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
		return null // TODO temp hack what should it actually return
	}
	const token_cookie = cookie['token']
	return (token_cookie)
}

export const deriveUsername = async ( request: ValidatedRequest, response: Response, next: NextFunction) => {
	const user = await userQueries.getUserByID(decodedToken.id);
	// TODO: does getUserByID really return null if not found?
	if (!user || !user.username || !user.id) {
		response.status(401).json({ error: 'token does not correspond to a user' })
		return;
	}
	request.userData.id = user.id;
	request.userData.username = user.username;
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
	request.userData.username = "";
	request.userData.id = 0;
	deriveUsername(request, response, next);	
	next()
}

// Ref:
// https://blog.logrocket.com/extend-express-request-object-typescript/
//  https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript