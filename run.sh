#!/bin/bash

root=$(pwd);

cd app/backend;

npm run dev & echo $! > ${root}/.backend.pid;
