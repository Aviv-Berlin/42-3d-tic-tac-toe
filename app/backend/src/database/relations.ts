import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	matches: {
		userPlayer1: r.one.users({
			from: r.matches.player1,
			to: r.users.id,
			alias: "matches_player1_users_id"
		}),
		userPlayer2: r.one.users({
			from: r.matches.player2,
			to: r.users.id,
			alias: "matches_player2_users_id"
		}),
		userWinner: r.one.users({
			from: r.matches.winner,
			to: r.users.id,
			alias: "matches_winner_users_id"
		}),
		users: r.many.users({
			from: r.matches.id.through(r.moves.matchId),
			to: r.users.id.through(r.moves.player),
			alias: "matches_id_users_id_via_moves"
		}),
	},
	users: {
		matchesPlayer1: r.many.matches({
			alias: "matches_player1_users_id"
		}),
		matchesPlayer2: r.many.matches({
			alias: "matches_player2_users_id"
		}),
		matchesWinner: r.many.matches({
			alias: "matches_winner_users_id"
		}),
	},
}))
