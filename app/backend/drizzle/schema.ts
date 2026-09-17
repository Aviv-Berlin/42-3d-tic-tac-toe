import { pgTable, serial, integer, text, timestamp, foreignKey, primaryKey, unique, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const conversations = pgTable("conversations", {
	id: serial().primaryKey(),
	user1: integer().notNull().references(() => users.id),
	user2: integer().notNull().references(() => users.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	unique("conversations_user1_user2_key").on(table.user1, table.user2),check("conversations_check", sql`(user1 < user2)`),]);

export const friendships = pgTable("friendships", {
	id: serial().primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id),
	friendId: integer("friend_id").notNull().references(() => users.id),
	status: text().default("pending"),
}, (table) => [
	unique("friendships_user_id_friend_id_key").on(table.userId, table.friendId),check("friendships_check", sql`(user_id < friend_id)`),check("friendships_status_check", sql`(status = ANY (ARRAY['pending'::text, 'accepted'::text, 'blocked'::text]))`),]);

export const matches = pgTable("matches", {
	id: serial().primaryKey(),
	player1: integer().notNull().references(() => users.id),
	player2: integer().notNull().references(() => users.id),
	difficulty: integer(),
	winner: integer().references(() => users.id),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	boardSize: integer("board_size").notNull(),
}, (table) => [
check("matches_difficulty_check", sql`(difficulty = ANY (ARRAY[0, 1, 2, 3]))`),]);

export const messages = pgTable("messages", {
	id: serial().primaryKey(),
	convoId: integer("convo_id").notNull().references(() => conversations.id),
	senderId: integer("sender_id").notNull().references(() => users.id),
	message: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const moves = pgTable("moves", {
	moveNr: integer("move_nr").notNull(),
	matchId: integer("match_id").notNull().references(() => matches.id),
	coordX: integer("coord_x").notNull(),
	coordY: integer("coord_y").notNull(),
	coordZ: integer("coord_z").notNull(),
	player: integer().notNull().references(() => users.id),
	playedAt: timestamp("played_at", { withTimezone: true }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.matchId, table.moveNr], name: "moves_pkey"}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey(),
	username: text().notNull(),
	email: text().notNull(),
	pwHash: text("pw_hash").notNull(),
	lastSeen: timestamp("last_seen", { withTimezone: true }).default(sql`now()`),
	fullScore: integer("full_score").default(1000),
	onlineScore: integer("online_score").default(1000),
}, (table) => [
	unique("users_email_key").on(table.email),	unique("users_username_key").on(table.username),]);
