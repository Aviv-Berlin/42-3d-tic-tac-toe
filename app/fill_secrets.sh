#!/bin/bash
# TODO if this script is going to be run from another dir, paths will need a to be constructed
# using a variable for the directory in which script is located 

set -euo pipefail

# For the smoothest transition to using Docker for postgres,
# we will fill Postgres's required ENV from the backend .env

# First checking that the file exists
if [ ! -s "./backend/.env" ]
then
	printf "Missing ./backend/.env. Please create and fill this file:
		SECRET=
		PORT=
		DB_HOST=
		DB_PORT=
		DB_NAME=
		DB_USER=
		DB_PASSWORD=
	"
	exit 1
fi

# And checking that it contains the ENV we need
source ./backend/.env
if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]
then
	printf "Please fill DB_USER and DB_NAME in ./backend/.env"
	exit 1
fi

# ENV for Postgres
postgres_env_file="./backend/postgres/postgres.env"
printf "POSTGRES ENV:\n"
if [ ! -s ./backend/postgres/postgres.env ]
# s = size. Here checking if file is nonexistant or empty
then
	touch ${postgres_env_file}
	printf "postgres.env file created\n"

	# May return to this approach at a later date
	#read -p "Enter POSTGRES_USER (new postgres user, owns the database): " postgres_user
	#echo "POSTGRES_USER=${postgres_user}" >> ${postgres_env_file}
	#read -p "Enter POSTGRES_DB (database name): " postgres_db
	#echo "POSTGRES_DB=${postgres_db}" >> ${postgres_env_file}
	
	echo "POSTGRES_DB=${DB_NAME}" >> ${postgres_env_file}
	echo "POSTGRES_USER=${DB_USER}" >> ${postgres_env_file}
else
	printf "Found existing postgres.env file.\n\n"
	printf "The contents will be used by Docker Compose for your database ENV.\n\n"
fi


# SECRETS for Postgres
printf "SECRETS:\n"
if [ ! -s ./secrets/postgres-passwd ]
then
	read -p "Enter password for database: " postgres_passwd
	# -s = silent, hides user input
	# TODO ask user to re-enter password, compare inputs
	# TODO offer option for openssl rand password generation
	echo -n "${postgres_passwd}" > ./secrets/postgres-passwd
	printf "\nPassword saved to /secrets/postgres-passwd.\n"
else
	printf "Found existing file at /secrets/postgres-passwd.\n"
	printf "The contents will be used by Docker Compose for your database password.\n"
	# TODO 
	# should also check that file does not contain ""
	# and even better, that password follows certain rules for minimum security
fi


# Reference: https://www.geeksforgeeks.org/linux-unix/bash-script-read-user-input/