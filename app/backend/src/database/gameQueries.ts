import { query } from "./db.ts";
import userQueries from "./userQueries.ts";
import { PlayerData } from "../../../shared/game.ts";

// export interface User {
//   id: number,
//   username: string,
//   email: string,
//   pw_hash: string
// }

// CREATE TABLE matches(
// 	id SERIAL PRIMARY KEY,
// 	player1 INT NOT NULL REFERENCES users(id),
// 	player2 INT NOT NULL REFERENCES users(id),
// 	-- size INT NOT NULL,
// 	-- game_type (spped game, normal game) - extra table customizations? (power ups, limit, size)
// 	winner INT REFERENCES users(id), -- NULL on draw
// 	started_at TIMESTAMPTZ DEFAULT NOW(),
// 	ended_at TIMESTAMPTZ
// );
// Creating a game
export async function createMatchEntry(p1: PlayerData, p2: PlayerData, winner: PlayerData, start: number, end: number) {
	console.log(`p1 name: ${p1.username}, p2 name: ${p2.username}`);
	const p1user = await userQueries.getUserByUsername(p1.username);
	console.log("p1user:", p1user);
	console.log("typeof p1user:", typeof p1user);
	console.log("p1user instanceof Promise:", p1user instanceof Promise);

	const p1id = p1user.id;
	const p2user = await userQueries.getUserByUsername(p2.username);
	const p2id = p2user.id;
	let winnerId = null;
	if (winner === p1)
		winnerId = p1id;
	else if (winner === p2)
		winnerId = p2id;
	console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}, start:${start}, end:${end}`);
	const result = await query(
		'INSERT INTO matches (player1, player2, winner, started_at, ended_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [p1id, p2id, winnerId, start, end]
	);

	console.log(`match added to database`);
	return result.rows[0];
}



export default {
	createMatchEntry,

};
