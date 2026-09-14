import { Pool } from "pg";
import { readFile } from 'node:fs/promises'; // API for async file operations in Node.js
import path from 'node:path';

const filePath = process.env.NODE_ENV === "prod" ? '/run/secrets/db_password' : path.join(import.meta.dirname, '../../../secrets/postgres-passwd');
const pw = await readFile(filePath, 'utf8');

console.log({
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.NODE_ENV === "prod" ? process.env.DB_PROD_HOST : process.env.DB_DEV_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: "****",
  DB_PORT: process.env.DB_PORT,
});

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.NODE_ENV === "prod" ? process.env.DB_PROD_HOST : process.env.DB_DEV_HOST,
	database: process.env.DB_NAME,
	password: pw.trim(),
	port: Number(process.env.DB_PORT),
});

export const query = (
	text: string,
	params?: unknown[]
) => pool.query(text, params);

export default pool;
