
# Setup

```bash
git clone <repo>
```

## Requirements
- Node.js LTS
- npm
- PostgreSQL

## Configure Database

After installing PostgreSQL, set up the database:

### Create Database User

```bash
sudo -u postgres createuser ttt_user --pwprompt
```

> [!NOTE]
> Enter the same password that will be used in DB_PASSWORD.

### Create Database Owned by Database User

```bash
sudo -u postgres createdb -O ttt_user ttt_db
```
### Import Schema / Data

> [!NOTE]
> These commands initialize the database schema. Running `schema.sql` on an existing database will remove existing tables and their data because it contains `DROP TABLE IF EXISTS` statements. 

```bash
cd app/backend/src/database
```

#### Snapshot (schema + all existing data)
```bash
sudo -u postgres psql -d ttt_db < schemaAndData.sql
```

#### Fresh database
```bash
sudo -u postgres psql -d ttt_db < schema.sql
```

#### Database with custom seed data
```bash
sudo -u postgres psql -d ttt_db < schema.sql
sudo -u postgres psql -d ttt_db < seed.sql
```

## Configure .env

Create '.env' file at 'app/backend/' and set values for all variables.

```bash
# TOKEN
SECRET=

# SERVER
PORT=3001

# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ttt_db
DB_USER=ttt_user
DB_PASSWORD=
```

## Install dependencies and run application

Run backend and frontend in seperate terminals:

```bash
# backend
cd app/backend
npm install
npm run dev

# frontend
cd app/frontend
npm install
npm run dev
```





