import { Pool } from "pg";
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(import.meta.dirname, '../../../secrets/postgres-passwd')

// source https://www.xjavascript.com/blog/typescript-read-file/
// what is an async function https://www.theodinproject.com/lessons/node-path-javascript-async-and-await
// why would we want this to be asyncronous, as recommended by first source

async function readPostGresPassword(): Promise<void> {

}

console.log({
	DB_USER: process.env.DB_USER,
	DB_HOST: process.env.DB_HOST,
	DB_NAME: process.env.DB_NAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_PORT: process.env.DB_PORT,
})

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
});

export const query = (
	text: string,
	params?: unknown[]
) => pool.query(text, params);

export default pool;
