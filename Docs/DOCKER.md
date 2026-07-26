# DOCKER
## Database Dockerfile
Our Dockerfile for the database uses the [official Postgres image](https://hub.docker.com/_/postgres).

Lots of info here: [official Postgres image repo on Github](https://github.com/docker-library/docs/blob/master/postgres/README.md)

### Postgres Environment Variables & Secrets

The official Postgres image *requires* passing in at least one environment variable (which can also be set using secrets):

- `POSTGRES_PASSWORD` : sets superuser password for PostgreSQL

We're also making use of these default environment variables, which will be read and processed by the official image's entrypoint script:

- `POSTGRES_DB` : the name of the our database

- `POSTGRES_USER` : the user which will own POSTGRES_DB (and has superuser privileges, within postgres)

More optional environment variables, which we are currently leaving empty / as default:

- `PGDATA` : where database data is stored.
	- defaults to /var/lib/postgresql/data for postgres version 17 and below

- `POSTGRES_HOST_AUTH_METHOD` : controls the auth-method for host connections
	- defaults to scram-sha-256 password authentication (prevents password sniffing and supports storing passwords on the server in a hashed format)

- `POSTGRES_INITDB_ARGS` : can be used to send args to postgres initdb


There is a built-in option for passing this password (as well as some other .env vars) as a Docker secret, like so:

```
$ docker run --name some-postgres -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres-passwd -d postgres
```

To make use of this much more secure option, we now have a `/secrets` directory at same level as the docker-compose.yaml.

For convenience, there is also a `fill_secrets.sh` script that creates the password file with the expected name. At some point, we could just have a Makefile that runs this script before docker compose up --build.

postgres.env
```
POSTGRES_USER=<database_user>
POSTGRES_DB=<database_name>
```

### Interacting with Postgres
postgres = the database server. This is our base image. Postgres the server has no CLI and can only be interacted with via the client, psql.

psql = the database client
