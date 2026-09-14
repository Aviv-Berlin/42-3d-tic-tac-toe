// simple CRUD operation on db - creating a new user, reading data about a user, updating a user's dara and deleting a user
//import pool from "./db.js";
// const result = await pool.query(
//	"SELECT * FROM users"
// );
import { query } from "./db.ts";
// const result = await query(
//	"SELECT * FROM users"
// );

/*
export interface User {
  id: number,
  username: string,
  email: string,
  pw_hash: string,
  full_score: number,
  online_score: number
}
*/

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

export async function getOnlineScoreByID(id: number) {
	const result = await query(
		'SELECT online_score FROM users WHERE id = $1;', [id]
	);

	return result.rows[0]?.online_score;
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

export async function updateUserScores(id: number, scoreChange: number, online: boolean) {
	const fullScore = scoreChange;
	let onlineScore = scoreChange;
	if (!online)
		onlineScore = 0;
	console.log(`updating online score for user #${id} new score: ${onlineScore} online: ${online} full:${fullScore}`);
	const result = await query(
		'UPDATE users SET full_score = GREATEST(full_score + $1, 0), online_score = GREATEST(online_score + $2, 0) WHERE id = $3 RETURNING *;', [fullScore, onlineScore, id]
	);
	console.log(`new scores: full:${result.rows[0].full_score} online:${result.rows[0].online_score}`)
	return result.rows[0]?.online_score;
}


// create rank data:
// 	id | full_rank | full_score | online_rank | online_score | total_users
// ----+-----------+------------+-------------+--------------+-------------
//   4 |         1 |       1138 |           1 |         1021 |           2
export async function getUserScores(id: number) {
	const result = await query(`
		SELECT *
		FROM (
			SELECT
				id,
				RANK() OVER (ORDER BY full_score DESC) AS full_rank,
				full_score,
				RANK() OVER (ORDER BY online_score DESC) AS online_rank,
				online_score,
				COUNT(*) OVER () AS total_users
			FROM users
			WHERE id NOT IN (1, 2, 3)
		) ranked_users
		WHERE id = $1;

	`, [id]);
	return result.rows[0];
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
	getOnlineScoreByID,
	deleteUser,
	createUser,
	updateUsername,
	updatePassword,
	getUserScores
};
