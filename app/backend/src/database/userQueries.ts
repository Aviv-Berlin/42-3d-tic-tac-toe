// simple CRUD operation on db - creating a new user, reading data about a user, updating a user's dara and deleting a user
//import pool from "./db.js";
// const result = await pool.query(
//	"SELECT * FROM users"
// );
import { query } from "./db.ts";
// const result = await query(
//	"SELECT * FROM users"
// );

export interface User {
  id: number,
  username: string,
  email: string,
  pw_hash: string
}

export async function getUserIdByUsername(username: string) {
	const result = await query(
		'SELECT id FROM users WHERE username = $1;', [username]
	);

	return result.rows[0]?.id;
}

export async function getUserIdByEmail(email: string) {
	const result = await query(
		'SELECT id FROM users WHERE email = $1;', [email]
	);

	return result.rows[0]?.id;
}

export async function getUsernameByID(id: number) {
	const result = await query(
		'SELECT username FROM users WHERE id = $1;', [id]
	);

	return result.rows[0]?.username;
}

export async function getHashedPasswordByID(id: number) {
	const result = await query(
		'SELECT pw_hash FROM users WHERE id = $1;', [id]
	);

	return result.rows[0]?.pw_hash;
}

// Creating a user
export async function createUser(username: string, email: string, pw_hash: string) {
	const result = await query(
		'INSERT INTO users (username, email, pw_hash) VALUES ($1, $2, $3) RETURNING *;', [username, email, pw_hash]
	);

	return result.rows[0]?.id;
}

// Update and delete a user

export async function updateUsername(username: string, id: number) {
	const result = await query(
		'UPDATE users SET username = $1 WHERE id = $2 RETURNING *;', [username, id]
	);

	return result.rows[0]?.username;
}

export async function updatePassword(newPassword: string, id: number) {
	const result = await query(
		'UPDATE users SET pw_hash = $1 WHERE id = $2 RETURNING *;', [newPassword, id]
	);

	return result.rows[0]?.id;
}

export async function deleteUser(id: number) {
	const result = await query(
		'DELETE FROM users WHERE id = $1 RETURNING *;', [id]
	);
	return result.rows[0]?.id;
}

export default {
	getUsernameByID,
	getUserIdByUsername,
	getUserIdByEmail,
	getHashedPasswordByID,
	deleteUser,
	createUser,
	updateUsername,
	updatePassword
};