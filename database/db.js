
const Pool = require("pg").Pool;

const pool = new Pool({
	user: "db_admin",
	host: "localhost",
	database: "ttt_db",
	password: "db3d42",
	port: 5432,
});

module.exports = {
	pool
};