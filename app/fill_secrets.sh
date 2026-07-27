#!/bin/bash
# TODO if this script is going to be run from another dir, paths will need a to be constructed
# using a variable for the directory in which script is located 

set -euo pipefail

env_file="./backend/postgres/postgres.env"

printf "POSTGRES ENV:\n"
if [ ! -s ./backend/postgres/postgres.env ]
# s = size. Here checking if file is nonexistant or empty
then
	touch ${env_file}
	printf "postgres.env file created\n"
	read -p "Enter POSTGRES_USER (new postgres user, owns the database): " postgres_user
	echo "POSTGRES_USER=${postgres_user}" >> ${env_file}
	read -p "Enter POSTGRES_DB (database name): " postgres_db
	echo "POSTGRES_DB=${postgres_db}" >> ${env_file}

else
	printf "Found existing file postgres.env.\n\n"
	printf "The contents will be used by Docker Compose for your database ENV.\n\n"
fi

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