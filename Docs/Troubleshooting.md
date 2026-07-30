# Troubleshooting

Issues encountered & how to solve:

# Postgres / psql (outside of container)
### On every command, Postgres or psql complains "could not change directory to < PWD > "

**Solution:** This is an oddly irrelevant complaint about postgers not having ownership of / access to the current directory. You will find that the user and database creation commands still succeeded, and this error message can just be ignored.

[How to check that user was created](https://neon.com/postgresql/administration/list-users)

[How to check that database was created](https://www.dbvis.com/thetable/postgres-list-databases/)

---

### Running postgres or psql commands as a specific postgres user results in an authentication error.
Example:
```
$ sudo psql -U ttt_user -d ttt_db < schema.sql
$ postgres "failed: FATAL: Peer authentication failed for user"
```
Caused by a mismatch between the OS username and the postgres username, despite "-U < username >."

**Work-Around:** Use a host flag. This changes the authentication method and prompts for the user's password:
```
sudo psql -U ttt_user -d -h 127.0.0.1 ttt_db < schema.sql
```
---

**Problem:** You've been running postgres using Docker. Now you want to go back to running postgres on the host machine. ```sudo -u postgres createdb ...``` results in error about a bad path.

**Solution:** First, to free up the port, make sure the container is no longer running.

```docker compose down```
```docker ps -a```<- to double check

Then, restart postgres on the host. `sudo systemctl start postgresql` or [Postgresql: Starting the Database Server](https://www.postgresql.org/docs/9.1/server-start.html).

---


## npm

Running ```npm run dev``` results in:
### ERR_UNKNOWN_FILE_EXTENSION
```
[1] TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/hallison/42-3d-tic-tac-toe/app/backend/src/server.ts
```
**Solution:** node.js needs to be updated.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash

<source the bashrc or zshrc>

sudo nvm install node
sudo nvm use node
node -v
```

Running ```npm install``` results in
### WARNINGS
