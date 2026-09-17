import { pgTable, serial, integer, text, timestamp, primaryKey, unique, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const matchesTable = pgTable("matches", {
	id: serial().primaryKey(),
	player1: integer().notNull().references(() => usersTable.id),
	player2: integer().notNull().references(() => usersTable.id),
	difficulty: integer(),
	winner: integer().references(() => usersTable.id),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	boardSize: integer("board_size").notNull(),
}, (table) => [
check("matches_difficulty_check", sql`(difficulty = ANY (ARRAY[0, 1, 2, 3]))`),]);

export const movesTable = pgTable("moves", {
	moveNr: integer("move_nr").notNull(),
	matchId: integer("match_id").notNull().references(() => matchesTable.id),
	coordX: integer("coord_x").notNull(),
	coordY: integer("coord_y").notNull(),
	coordZ: integer("coord_z").notNull(),
	player: integer().notNull().references(() => usersTable.id),
	playedAt: timestamp("played_at", { withTimezone: true }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.matchId, table.moveNr], name: "moves_pkey"}),
]);

export const usersTable = pgTable("users", {
	id: serial().primaryKey(),
	username: text().notNull(),
	email: text().notNull(),
	pwHash: text("pw_hash").notNull(),
	lastSeen: timestamp("last_seen", { withTimezone: true }).default(sql`now()`),
	fullScore: integer("full_score").default(1000),
	onlineScore: integer("online_score").default(1000),
}, (table) => [
	unique("users_email_key").on(table.email),	unique("users_username_key").on(table.username),]);
