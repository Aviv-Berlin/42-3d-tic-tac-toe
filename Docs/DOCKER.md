# DOCKER
## Database Dockerfile
Our Dockerfile for the database uses the [official Postgres image](https://hub.docker.com/_/postgres).

Lots of info here: [official Postgres image repo on Github](https://github.com/docker-library/docs/blob/master/postgres/README.md)

### Postgres Environment Variables
The official image *requires* passing in at least one environment variable: POSTGRES_PASSWORD (sets superuser password for PostgreSQL).

There is a built-in option for passing this password (as well as some other .env vars) as a Docker secret, like so:

```
$ docker run --name some-postgres -e POSTGRES_PASSWORD_FILE=/run/secrets/postgres-passwd -d postgres
```

### Interacting with Postgres
postgres = the database server. This is our base image. Postgres the server has no CLI and can only be interacted with via the client, psql.

psql = the database client
