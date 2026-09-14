import { query } from "./db.ts";
import userQueries, { updateUserScores, getOnlineScoreByID } from "./userQueries.ts";
import { Move, GameData, AiLevel } from "../../../shared/game.ts";

export interface MatchEntry {
	id: number,
	player1: number,
	player2: number,
	winner: number,
	difficulty: AiLevel,
	started_at: Date,
	ended_at: Date,
	board_size: number
  }

async function calculateOnlineScore(game: GameData, p1ID: number, p2ID: number, winnerId: number | null) {
	const p1Score = await getOnlineScoreByID(p1ID);
	const p2Score = await getOnlineScoreByID(p2ID);
	const scoreDiff = Math.abs(p1Score - p2Score);
	let scoreBonus = scoreDiff / 30;
	if (scoreBonus > 30)
		scoreBonus = 30;
	let p1score = 0;
	if (winnerId === p1ID)
		p1score = game.size * 10 + scoreBonus;
	else {
		p1score = -10;
		if (p1ID > p2ID)
			p1score =- (scoreBonus / 2);
	}
	if (winnerId !== p1ID && winnerId !== p2ID)
		p1score = 0;
	return (Math.round(p1score));
}

function calculateAiScore(game: GameData, p1ID: number, p2ID: number, winnerId: number | null) {
	let p1score = 0;
	if (winnerId === p1ID)
		p1score = game.level * game.size * 3;
	else
		p1score = -30 / game.level;
	if (winnerId !== p1ID && winnerId !== p2ID)
		p1score = 0;
	return (Math.round(p1score));
}

// Creating a game
export async function createMatchEntry(game: GameData) {
	const p1id = await userQueries.getUserIdByUsername(game.player1.username);
	const p2id = await userQueries.getUserIdByUsername(game.player2.username);

		let winnerId = null;
	if (game.winner?.username === game.player1.username)
		winnerId = p1id;
	else if (game.winner?.username === game.player2.username)
		winnerId = p2id;

	const startDate = new Date(game.gameStart);
	const endDate = new Date(game.gameEnd);
	// console.log(`p1: ${p1.type} ${p1.username}, p2: ${p2.type} ${p2.username}, winner: ${winner?.type} ${winner?.username}`);
	// console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}`);
	const result = await query(
		'INSERT INTO matches (player1, player2, winner, difficulty, started_at, ended_at, board_size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
		[p1id, p2id, winnerId, game.level, startDate, endDate, game.size]
	);
	createMoveHistory(game.moves, p1id, p2id, result.rows[0]);
	let p1score = 0
	let p2score = 0;
	let online = true;
	if (p2id === 2) {
		p1score = calculateAiScore(game, p1id, p2id, winnerId);
		p2score = calculateAiScore(game, p2id, p1id, winnerId);
		online = false;
	}
	else {
		p1score = await calculateOnlineScore(game, p1id, p2id, winnerId);
		p2score = await calculateOnlineScore(game, p2id, p1id, winnerId);
	}
	updateUserScores(p1id, p1score, online);
	updateUserScores(p2id, p2score, online);
	console.log(`match added to database`);
	return result.rows[0];
}

export async function createMoveHistory(moves: Move[], p1: number, p2: number, match: MatchEntry) {
	const players = [0, p1, p2];
	for (let i = 0; i < moves.length; i++) {
		moves[i];
		await query(
			'INSERT INTO moves (move_nr, match_id, coord_x, coord_y, coord_z, player, played_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
			[i + 1, match.id, moves[i].pos.x, moves[i].pos.y, moves[i].pos.z, players[moves[i].player], moves[i].time])
	}
}

export default {
	createMatchEntry,

};
