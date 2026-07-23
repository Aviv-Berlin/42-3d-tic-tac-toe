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

// Read data for all users or a single one
// 1. Get User by userusername, Email or ID
export async function getUserByUsername(username: string) {
	const result = await query(
		'SELECT * FROM users WHERE username = $1;', [username]
	);

	return result.rows[0];
}

export async function getUserByEmail(email: string) {
	const result = await query(
		'SELECT * FROM users WHERE email = $1;', [email]
	);

	return result.rows[0];
}

export async function getUserByID(id: number) {
	const result = await query(
		'SELECT * FROM users WHERE id = $1;', [id]
	);

	return result.rows[0];
}

// 2. Get All Users
export async function getAllUsers() {
	const result = await query(
		'SELECT * FROM users ORDER BY id ASC;'
	);

	return result.rows;
}

// Creating a user
export async function createUser(username: string, email: string, pw_hash: string) {
	const result = await query(
		'INSERT INTO users (username, email, pw_hash) VALUES ($1, $2, $3) RETURNING *;', [username, email, pw_hash]
	);

	return result.rows[0];
}

// Update and delete a user
export async function updateUser(username: string, email: string, pw_hash: string, id: number) {
	const result = await query(
		'UPDATE users SET username = $1, email = $2, pw_hash = $3 WHERE id = $4 RETURNING *;', [username, email, pw_hash, id]
	);

	return result.rows[0];
}

export async function deleteUser(id: number) {
	const result = await query(
		'DELETE FROM users WHERE id = $1 RETURNING *;', [id]
	);

	return result.rows[0];
}

export default {
	getAllUsers,
	getUserByID,
	getUserByUsername,
	getUserByEmail,
	deleteUser,
	createUser,
	updateUser
};