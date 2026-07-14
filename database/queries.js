// simple CRUD operation on db - creating a new user, reading data about a user, updating a user's dara and deleting a user
const db = require("./db");

// creating a user:
const createUser = (req, res) => {
	const { user_name, user_email, password_hash } = req.body;

	db.pool.query("INSERT INTO users (user_name, user_email, password_hash) VALUES ($1, $2, $3) RETURNING *;", [user_name, user_email, password_hash], (err, ressult) => {
		if (err) {
			throw err;
		}
		
		res.status(201).send('User added with ID: ${result.rows[0].user_id');
	});
}

// read data for all users ir a single one:
const getAllUsers = (req, res) => {
	db.pool.query("SELECT * FROM users ORDER BY user_id ASC", (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json(result.rows);
	});
}

const getUserById = (req, res) => {
	const id = parseInt(req.params.id);

	db.pool.query("SELECT * FROM users WHERE id = $1;", [id], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).json(result.rows);
	});
}

//update and delete a user:
const updateUser = (req, res) => {
	const id = parseInt(req.params.id);

	const { email } = req.body;

	if (email) {
		db.pool.query(
			"UPDATE users SET email = $1 WHERE id = $2;",
			[email, id],
			(err, result) => {
				if (err) {
					throw err;
				}
				
				res.status(200).send('User modified with ID: ${id}');
			}
		);
	} else {
		res.status(400).send("An email must be provided!");
	}
}

const deleteUser = (req, res) => {
	const id = parseInt(req.params.id);

	db.pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
		if (err) {
			throw err;
		}

		res.status(200).send('User deleted with ID: ${id}');
	});
}

module.exports = {
	getAllUsers,
	getUserById,
	deleteUser,
	createUser,
	updateUser
};