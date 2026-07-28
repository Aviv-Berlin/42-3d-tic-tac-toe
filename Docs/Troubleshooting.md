# Troubleshooting

Issues encountered & how to solve:

# Postgres / psql

**Problem:** You've been running postgres using Docker. Now you want to go back to running postgres on the host machine. ```sudo -u postgres createdb ...``` results in error about a bad path.

**Solution:** First, to free up the port, make sure the container is no longer running.

```docker compose down```
```docker ps -a```<- to double check

Then, restart postgres on the host. [Postgresql: Starting the Database Server](https://www.postgresql.org/docs/9.1/server-start.html) Afterwards, there were several more issues to solve (detailed below), so there may be a better way or a missing piece.

---

**Problem:** On every command, Postgres or psql complains "could not change directory to < PWD > "

**Solution:** This is an oddly irrelevant complaint about not having ownership of / access to the current directory. You will find that the user and database creation commands still succeeded.

[How to check that user was created](https://neon.com/postgresql/administration/list-users)
[How to check that database was created](https://www.dbvis.com/thetable/postgres-list-databases/)
---

**Problem:** Running postgres or psql commands as a specific postgres user results in an authentication error. Example:
```
$ sudo psql -U ttt_user -d ttt_db < schema.sql
$ postgres "failed: FATAL: Peer authentication failed for user"
```
Seems to be caused by a mismatch between the OS username and the postgres username, despite "-U < username >." Unclear why this error was encountered once, but not previously. I suspect it has something to do with how the postgres server was restarted.

**Work-Around:** Use a host flag. This changes the authentication method and prompts for the user's password:
```
sudo psql -U ttt_user -d -h 127.0.0.1 ttt_db < schema.sql
```
---

## npm

**Problem:**: Running ```npm run dev``` results in:

```
[1] TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/hallison/42-3d-tic-tac-toe/app/backend/src/server.ts
```
**Solution:*** node.js needs to be updated.
```
sudo apt install nvm
sudo nvm install node
sudo nvm use node
node -v
```