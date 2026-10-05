#!/bin/bash

# .env

env_file="app/backend/.env"
if [[ ! -s $env_file ]]; then
	echo "Creating $env_file"
	echo "PORT=3001" >> "$env_file"
	echo "DB_PORT=5432" >> "$env_file"
	echo "DB_DEV_HOST=localhost" >> "$env_file"
	echo "DB_PROD_HOST=database" >> "$env_file"
	echo "DB_NAME=ttt_db" >> "$env_file"
	echo "DB_USER=ttt_user" >> "$env_file"
fi

# postgres.env
postgres_env_file="app/backend/postgres/postgres.env"
if [[ ! -s $postgres_env_file ]]; then
	echo "Creating $postgres_env_file"
	echo "POSTGRES_DB=ttt_db" > "$postgres_env_file"
	echo "POSTGRES_USER=ttt_user" >> "$postgres_env_file"
fi

# secrets
postgres_pw_file="app/secrets/postgres-passwd"
if [[ ! -s $postgres_pw_file ]]; then
    echo "Creating $postgres_pw_file"
	$(openssl rand -hex 16 > $postgres_pw_file)
fi

jwt_secret_file="app/secrets/jwt-secret"
if [[ ! -s $jwt_secret_file ]]; then
    echo "Creating $jwt_secret_file"
	$(openssl rand -base64 16 > $jwt_secret_file)
fi
