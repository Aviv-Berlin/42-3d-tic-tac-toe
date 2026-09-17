import { dbUrl } from './db.js'
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './schema.js';

const db = drizzle(dbUrl!);

export async function getUsers () {
const users = await db.select().from(usersTable);
console.log('Getting all users from the database: ', users);
}


export default {
	getUsers,
}
