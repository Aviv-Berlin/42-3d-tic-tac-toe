DROP TABLE IF EXISTS game_replay;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS stats; -- at first not nessescary, only if computing slows down consider
--DROP TABLE IF EXISTS customizations; -- own table or part of user table? depends: can user own many items? 

CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	user_name TEXT NOT NULL UNIQUE,
	user_email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL, -- adjust 
	last_seen TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (user_name, user_email, password_hash) VALUES
('Guest', 'guest@example.com', 'trG45Vm');

CREATE TABLE friendships(
	friendship_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(user_id),
	friend_id INT NOT NULL REFERENCES users(user_id),
	status TEXT DEFAULT 'pending'
	CHECK (status IN ('pending', 'accepted', 'blocked')),
	UNIQUE (user_id, friend_id),
	CHECK (user_id < friend_id)
);

CREATE TABLE conversations(
	convo_id SERIAL PRIMARY KEY,
	user_1 INT NOT NULL REFERENCES users(user_id),
	user_2 INT NOT NULL REFERENCES users(user_id),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	UNIQUE (user_1, user_2),
	CHECK (user_1 < user_2)
);

CREATE TABLE messages(
	message_id SERIAL PRIMARY KEY,
	convo_id INT NOT NULL REFERENCES conversations(convo_id),
	sender_id INT NOT NULL REFERENCES users(user_id),
	message TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches(
	match_id SERIAL PRIMARY KEY,
	player_a INT NOT NULL REFERENCES users(user_id),
	player_b INT NOT NULL REFERENCES users(user_id),
	-- size INT NOT NULL,
	-- game_type (spped game, normal game) - extra table customizations? (power ups, limit, size)
	winner INT REFERENCES users(user_id), -- NULL on draw
	started_at TIMESTAMPTZ DEFAULT NOW(),
	ended_at TIMESTAMPTZ
);

CREATE TABLE game_replay(
	move_number INT NOT NULL,
	match_id INT NOT NULL REFERENCES matches(match_id),
	coord_x INT NOT NULL,
	coord_y INT NOT NULL,
	coord_z INT NOT NULL,
	played_at INTERVAL NOT NULL,
	PRIMARY KEY(match_id, move_number)
);