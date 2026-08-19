import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET
if (!secret){
	throw new Error("Missing SECRET");
}
const secretKey: string = secret;
export { secretKey };

export const getTokenFrom = (request: Request) => {
	const cookie = request.cookies;
	if (!cookie){
		console.log('getTokenFrom... !cookies')
		return null // TODO temp hack what should it actually return
	}
	const token_cookie = cookie['token']
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