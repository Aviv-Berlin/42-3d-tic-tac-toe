import { query } from "./db.js";
import { dbUrl } from './db.js'
import { drizzle } from 'drizzle-orm/node-postgres';
import { matchesTable, usersTable, movesTable } from './schema.js';
import { eq, lt, gte, ne, sql, notInArray } from 'drizzle-orm';
import { playerExit } from "../game/socketHandlersBE.js";

const db = drizzle(dbUrl!);

export async function getUserIdByUsername(username: string) {
	const result = await db.select({
		id: usersTable.id
		}).from(usersTable)
		.where(eq(usersTable.username, username));

	console.log(`ormquery result: ${result[0].id} from ${username}`)
	return result[0]?.id;
}

export async function getUserIdByEmail(email: string) {
	const result = await db.select({
		id: usersTable.id
		}).from(usersTable)
		.where(eq(usersTable.email, email));

	return result[0]?.id;
}

export async function getUsernameByID(id: number) {
	const result = await db.select({
		username: usersTable.username
		}).from(usersTable)
		.where(eq(usersTable.id, id));

	return result[0]?.username;
}

export async function getHashedPasswordByID(id: number) {
	const result = await db.select({
		pwHash: usersTable.pwHash
		}).from(usersTable)
		.where(eq(usersTable.id, id));

	return result[0]?.pwHash;
}

export async function getOnlineScoreByID(id: number) {
	const result = await db.select({
		onlineScore: usersTable.onlineScore
		}).from(usersTable)
		.where(eq(usersTable.id, id));
	query(
		'SELECT online_score FROM users WHERE id = $1;', [id]
	);

	return result[0]?.onlineScore;
}

// Creating a user
export async function createUser(username: string, email: string, pw_hash: string) {
	const result = await db.insert(usersTable).values({
		username: username,
		email: email,
		pwHash: pw_hash
	}).returning ({id: usersTable.id});

	return result[0]?.id;
}

// Update and delete a user

export async function updateUsername(username: string, id: number) {
	const result = await db.update(usersTable).set({
		username: username
	}).where(eq(usersTable.id, id))
	.returning({username: usersTable.username});

	return result[0]?.username;
}

export async function updatePassword(newPassword: string, id: number) {
	const result = await db.update(usersTable).set({
		pwHash: newPassword
	}).where(eq(usersTable.id, id))
	.returning({id: usersTable.id});

	return result[0]?.id;
}

export async function updateUserScores(id: number, scoreChange: number, online: boolean) {
	const fullScore = scoreChange;
	let onlineScore = scoreChange;
	if (!online)
		onlineScore = 0;

	const curFullRes = await db.select({
		fullScore: usersTable.fullScore
	}).from(usersTable)
	.where(eq(usersTable.id, id));
	const curFull = curFullRes[0]?.fullScore ?? 0;
	const newFull = Math.max((curFull + fullScore), 0)

	const curOnlineRes = await db.select({
		onlineScore: usersTable.onlineScore
	}).from(usersTable)
	.where(eq(usersTable.id, id));
	const curOnline = curOnlineRes[0]?.onlineScore ?? 0;
	const newOnline = Math.max((curOnline + onlineScore), 0)

	// console.log(`updating online score for user #${id} new score: ${onlineScore} online: ${online} full:${fullScore}`);
	const result = await db.update(usersTable).set({
		fullScore: newFull,
		onlineScore: newOnline
	}).where(eq(usersTable.id, id))
	.returning({
		fullScore: usersTable.fullScore,
		onlineScore: usersTable.onlineScore});

	console.log(`new scores: full:${result[0]?.fullScore} online:${result[0]?.onlineScore}`)
	return result[0]?.onlineScore;
}


// create rank data:
// 	id | full_rank | full_score | online_rank | online_score | total_users
// ----+-----------+------------+-------------+--------------+-------------
//   4 |         1 |       1138 |           1 |         1021 |           2
export async function getUserScores(id: number) {
	const rankedUsers = db
	.select({
		id: usersTable.id,
		fullRank: sql<number>`RANK() OVER (ORDER BY ${usersTable.fullScore} DESC)`.as('full_rank'),
		fullScore: usersTable.fullScore,
		onlineRank: sql<number>`RANK() OVER (ORDER BY ${usersTable.onlineScore} DESC)`.as('online_rank'),
		onlineScore: usersTable.onlineScore,
		totalUsers: sql<number>`COUNT (*) OVER ()`.as('total_users')
	}).from(usersTable)
	.where(notInArray(usersTable.id, [1, 2, 3]))
	.as('ranked_users');

	const result = await db
	.select()
	.from(rankedUsers)
	.where(eq(rankedUsers.id, id));

	// query(`
	// 	SELECT *
	// 	FROM (
	// 		SELECT
	// 			id,
	// 			RANK() OVER (ORDER BY full_score DESC) AS full_rank,
	// 			full_score,
	// 			RANK() OVER (ORDER BY online_score DESC) AS online_rank,
	// 			online_score,
	// 			COUNT(*) OVER () AS total_users
	// 		FROM users
	// 		WHERE id NOT IN (1, 2, 3)
	// 	) ranked_users
	// 	WHERE id = $1;
	// `, [id]);

	const data = {
		id: Number(result[0].id),
		full_rank: Number(result[0].fullRank),
		full_score: Number(result[0].fullScore),
		online_rank: Number(result[0].onlineRank),
		online_score: Number(result[0].onlineScore),
		total_users: Number(result[0].totalUsers)
	}

	console.log(`
		id: ${Number(result[0].id)},
		full_rank: ${Number(result[0].fullRank)},
		full_score: ${Number(result[0].fullScore)},
		online_rank: ${Number(result[0].onlineRank)},
		online_score: ${Number(result[0].onlineScore)},
		total_users: ${Number(result[0].totalUsers)}`);

	return data;
}


export async function deleteUser(id: number) {
	await db.delete(usersTable).where(eq(usersTable.id, id));
	return ;
}

export async function updateHistory(userId: number, placeholderID: number) {

	await db.update(matchesTable)
	.set({player1: placeholderID})
	.where(eq(matchesTable.player1, userId));

	await db.update(matchesTable)
	.set({player2: placeholderID})
	.where(eq(matchesTable.player2, userId));

	await db.update(matchesTable)
	.set({winner: placeholderID})
	.where(eq(matchesTable.winner, userId));

	await db.update(movesTable)
	.set({player: placeholderID})
	.where(eq(movesTable.player, userId));
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
	updateHistory,
	getUserScores
};
