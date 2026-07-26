#!/bin/bash

set -euo pipefail

if [ ! -s ./secrets/postgres-passwd ]
# s = size. Here checking if file is nonexistant or empty
then
	read -sp "Enter password for database: " postgres_passwd
	# -s = silent, hides user input
	# TODO ask user to re-enter password, compare inputs
	# TODO offer option for openssl rand password generation
	echo -n "$postgres_passwd" > ./secrets/postgres-passwd
	printf "\nPassword saved to /secrets/postgres-passwd.\n"
else
	printf "Found existing file at /secrets/postgres-passwd.\n"
	printf "The contents will be used by Docker Compose for your database password.\n"
	# TODO 
	# should also check that file does not contain ""
	# and even better, that password follows certain rules for minimum security
fi

# Reference: https://www.geeksforgeeks.org/linux-unix/bash-script-read-user-input/