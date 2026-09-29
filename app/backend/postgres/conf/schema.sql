DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS stats; -- at first not nessescary, only if computing slows down consider
--DROP TABLE IF EXISTS customizations; -- own table or part of user table? depends: can user own many items?

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	pw_hash TEXT NOT NULL, -- adjust
	last_seen TIMESTAMPTZ DEFAULT NOW(),
	full_score INT DEFAULT 1000,
	online_score INT DEFAULT 1000
);

INSERT INTO users (username, email, pw_hash) VALUES
('guest', 'guest@example.com', 'trG45Vm'),
('ai', 'ai@example.com', 'trG45Vu'),
('deleted', 'deleted@example.com', 'trG45Vm');

CREATE TABLE matches(
	id SERIAL PRIMARY KEY,
	player1 INT NOT NULL REFERENCES users(id),
	player2 INT NOT NULL REFERENCES users(id),
	difficulty INTEGER CHECK (difficulty IN (0, 1, 2, 3)),
	-- size INT NOT NULL,
	-- game_type (spped game, normal game) - extra table customizations? (power ups, limit, size)
	winner INT REFERENCES users(id), -- NULL on draw
	started_at TIMESTAMPTZ DEFAULT NOW(),
	ended_at TIMESTAMPTZ,
	board_size INT NOT NULL
);

CREATE TABLE moves(
	move_nr INT NOT NULL,
	match_id INT NOT NULL REFERENCES matches(id),
	coord_x INT NOT NULL,
	coord_y INT NOT NULL,
	coord_z INT NOT NULL,
	player INT NOT NULL REFERENCES users(id),
	played_at TIMESTAMPTZ NOT NULL,
	PRIMARY KEY(match_id, move_nr)
);
