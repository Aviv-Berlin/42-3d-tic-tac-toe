# DOCKER

# How to Run with Containerized Postgres
1) Make sure that `/app/backend/.env` exists and contains all required vars (see Docs/README.md)
2) IF setting up Tic-Tac-Toe Docker for the first time ... From within the `/app` directory, run the `./setup_docker.sh` script. Password entered here should match the password in `/app/backend/.env`
	```
	./setup_docker.sh
	```

3) Stop Postgres from running outside the container, so that Postgres inside the container can have its port.

	```
	sudo systemctl stop postgresql
	```

3) From with the `/app` directory, run:
	```
	docker compose up --build
	```
4) Build backend and frontend as usual:
	- from within `/app/frontend`, run:
		- `npm install` (only necessary if something has changed)
		-  `npm run dev`
	- from within `/app/backend`, run
		- `npm install` (again, only needed after changes or a merge)
		- `nmp run dev -- --host`
		* The "-- --host" flag is optional. If you're working on a VM, this allows you to connect to the web app using your host's browser, assuming ports 5173 and 3001 are forwarded by your VM settings.
	- access via `http://localhost:5173`

All of these steps above may be combined with a Makefile command in the future.

### Data Persistence

Now, try creating a new signup. Thanks to the volume storage, your new user and their data will still be there after you've powered the container down and back up again. From the `/app` directory...

To power down:
```
docker compose down
```

To power down AND delete your volume contents:
```
docker compose down -v
```
To power up again (and if you changed the Dockerfile, use flag --build):
```
docker compose up
```

### Volumes vs. Inititalizing the Database with Previous Database Dump
For many cases, the use of volumes could replace the previous method of initializing a database on startup with a database dump ("schemaAndData.sql").

However, there might still be cases where we want to initialize the container with a dumped database, and in this case, we can alter the Dockerfile to pull in that database. To do this...

First delete or move the contents of your volume data, so you're starting with an empty database on the next build. It's `docker compose down -v` to simply wipe the contents. If you want to copy the contents somewhere... your volume lives at `/home/$USER/3d_ttt_data/postgres`, and because postgres owns this directory, you will need to `su root` to interact with it manually.

Now to initialize with a dumped database on the next build, see comments in the Dockerfile -- it's simple.

More thoughts on volumes and data persistence near the bottom of this doc.

# About the Docker Set-Up

## Database Dockerfile
Our Dockerfile for the database uses the [official Postgres image](https://hub.docker.com/_/postgres).

Lots of info here: [official Postgres image repo on Github](https://github.com/docker-library/docs/blob/master/postgres/README.md)

### Postgres Environment Variables & Secrets

The official Postgres image *requires* passing in at least one environment variable (which can also be set using secrets):

- `POSTGRES_PASSWORD` : sets superuser password for PostgreSQL

We're also making use of these default environment variables, which will be read and processed by the official image's entrypoint script:

- `POSTGRES_DB` : the name of the our database

- `POSTGRES_USER` : the user which will own POSTGRES_DB (and has superuser privileges, within postgres)

---

> More optional environment variables, which we are currently leaving empty / as default:
>
>- `PGDATA` : where database data is stored.
>	- defaults to /var/lib/postgresql/data for postgres version 17 and below
>
>- `POSTGRES_HOST_AUTH_METHOD` : controls the auth-method for host connections
>	- defaults to scram-sha-256 password authentication (prevents password sniffing and supports storing passwords on the server in a hashed format)
>
>- `POSTGRES_INITDB_ARGS` : can be used to send args to postgres initdb

---

### Our Handling of ENV and Secrets

There is a built-in option for setting the required Postgres password using a Docker secret. By using `POSTGRES_PASSWORD_FILE` instead of `POSTGRES_PASSWORD`, we can copy the password file path instead of the password contents. This keeps the password contents out of logs.

```
$ docker run --name some-postgres -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres-passwd -d postgres
```

For this purpose we have a `/secrets` directory at same level as the docker-compose.yaml, and a password file is created here when you run `setup_docker.sh`

### Our Handling of Volumes
We're used Docker-managed volumes which live in a `/home/$USER/3d_ttt_data` directory. This directory is created by the setup script. This is exactly how we handled volumes in Inception, and based on trial-and-error, I believe this approach is the one that will cause us the least annoyance.

Why not put the volumes in the repo directory, and just gitignore the contents?
1. Docker compose requires an absolute path for Docker-managed volumes, which is tricky to make portable
2. Regardless, and even if we switch to a bind-mount (which does allow a relative path)... git will constantly complain about not being able to access the directory once it's own by postgres, despite inclusion in gitignore.

Why use Docker-managed volumes instead of a bind mount?
- It's nice to be able to delete the volume with a simple "-v" command, instead of switching to root to manually force remove directory contents.

Why not let Docker choose the location?
- When we want to do something with the data, it's nice to already know where it lives.



### The Possibility of Multiple Volumes

It occurs to me that what might be even more useful is the possibility of multiple volumes with different database contents (similar to multiple database dumps), each of which could be named, saved and loaded to test different sets of users. I believe this is something that could be added in the future, if we decide it's worth the time spent & a bit more complexity.