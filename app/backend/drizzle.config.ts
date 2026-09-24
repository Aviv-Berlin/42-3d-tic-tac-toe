import 'dotenv/config';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { defineConfig } from 'drizzle-kit';
import { dbUrl } from './src/database/db.js'

dotenvExpand.expand(dotenv.config());

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
});
