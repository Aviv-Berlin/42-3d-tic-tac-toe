DROP TABLE IF EXISTS game_replay;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS stats; -- at first not nessescary, only if computing slows down consider
--DROP TABLE IF EXISTS customizations; -- own table or part of user table? depends: can user own many items? 

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	pw_hash TEXT NOT NULL, -- adjust 
	last_seen TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, email, pw_hash) VALUES
('Guest', 'guest@example.com', 'trG45Vm');

CREATE TABLE friendships(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id),
	friend_id INT NOT NULL REFERENCES users(id),
	status TEXT DEFAULT 'pending'
	CHECK (status IN ('pending', 'accepted', 'blocked')),
	UNIQUE (user_id, friend_id),
	CHECK (user_id < friend_id)
);

CREATE TABLE conversations(
	id SERIAL PRIMARY KEY,
	user1 INT NOT NULL REFERENCES users(id),
	user2 INT NOT NULL REFERENCES users(id),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	UNIQUE (user1, user2),
	CHECK (user1 < user2)
);

CREATE TABLE messages(
	id SERIAL PRIMARY KEY,
	convo_id INT NOT NULL REFERENCES conversations(id),
	sender_id INT NOT NULL REFERENCES users(id),
	message TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches(
	id SERIAL PRIMARY KEY,
	player1 INT NOT NULL REFERENCES users(id),
	player2 INT NOT NULL REFERENCES users(id),
	-- size INT NOT NULL,
	-- game_type (spped game, normal game) - extra table customizations? (power ups, limit, size)
	winner INT REFERENCES users(id), -- NULL on draw
	started_at TIMESTAMPTZ DEFAULT NOW(),
	ended_at TIMESTAMPTZ
);

CREATE TABLE game_replay(
	move_nr INT NOT NULL,
	match_id INT NOT NULL REFERENCES matches(id),
	coord_x INT NOT NULL,
	coord_y INT NOT NULL,
	coord_z INT NOT NULL,
	played_at INTERVAL NOT NULL,
	PRIMARY KEY(match_id, move_nr)
);