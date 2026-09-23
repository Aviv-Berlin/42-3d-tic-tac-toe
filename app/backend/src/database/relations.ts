import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	matchesTable: {
		userPlayer1: r.one.usersTable({
			from: r.matchesTable.player1,
			to: r.usersTable.id,
			alias: "matchesTable_player1_users_id"
		}),
		userPlayer2: r.one.usersTable({
			from: r.matchesTable.player2,
			to: r.usersTable.id,
			alias: "matchesTable_player2_users_id"
		}),
		userWinner: r.one.usersTable({
			from: r.matchesTable.winner,
			to: r.usersTable.id,
			alias: "matchesTable_winner_users_id"
		}),
		users: r.many.usersTable({
			from: r.matchesTable.id.through(r.movesTable.matchId),
			to: r.usersTable.id.through(r.movesTable.player),
			alias: "matchesTable_id_users_id_via_moves"
		}),
	},
	usersTable: {
		matchesPlayer1: r.many.matchesTable({
			alias: "matchesTable_player1_users_id"
		}),
		matchesPlayer2: r.many.matchesTable({
			alias: "matchesTable_player2_users_id"
		}),
		matchesWinner: r.many.matchesTable({
			alias: "matchesTable_winner_users_id"
		}),
	},
}))
