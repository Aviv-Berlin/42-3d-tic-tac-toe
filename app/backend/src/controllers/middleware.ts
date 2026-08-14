//import { readFile } from 'node:fs/promises';
//import path from 'node:path';
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Is it okay to export secret or can this result in it leaking somewhere else possibly?
const secret = process.env.SECRET
if (!secret){
	throw new Error("Missing SECRET");
}
const secretKey: string = secret;
export { secretKey };

// TODO: the secret key should probably live in secrets, not ENV
// saving this for later while still working on the tokens, for the sake of incremental changes
//const secretFilePath = path.join(import.meta.dirname, '../../../secrets/key')
// const secret = await readFile(secretFilePath, 'utf8');

export const getTokenFrom = (request: Request) => {
	const cookie = request.cookies;
	if (!cookie){
		console.log('getTokenFrom... !cookies')
		return null // TODO temp hack what should it actually return
	}
	const token_cookie = cookie['token']
	/*
	console.log('getTokenFrom. token_cookie = ', token_cookie)
	const authorization = token_cookie.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
	*/
	return (token_cookie)
}

export const checkToken = (request: Request, response: Response, next: NextFunction) => {
	const token = getTokenFrom(request)
	if (!token) {
 		return response.status(401).json({ error: 'missing token' })
		// TODO different response code?
	}
	const decodedToken = jwt.verify(token, secretKey)
	if (typeof decodedToken === `string`) {
 		return response.status(401).json({ error: 'missing token' })
		// TODO different response code / msg? (this case should never occur)
	}
	console.log(`decoded Token id = ${decodedToken.id}`)
	if (!decodedToken.id) {
 		return response.status(401).json({ error: 'no id. token invalid' })
	}
	/*
	const user = await User.findById(decodedToken.id)
	if (!user) {
		return response.status(400).json({ error: 'UserId missing or not valid' })
	}
		*/
	next()
}