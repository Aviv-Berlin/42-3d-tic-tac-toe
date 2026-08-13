//import { readFile } from 'node:fs/promises';
//import path from 'node:path';
import { type Request } from 'express';

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
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}
