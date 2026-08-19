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
	// TODO: Next thing to implement is identifying the user by their token
	// const user = await User.findById(decodedToken.id)
	// if (!user) {
	//	return response.status(400).json({ error: 'UserId missing or not valid' })
	// }
	next()
}