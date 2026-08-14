#!/bin/bash

root=$(pwd);

cd app/backend;

npm run dev & echo $! > ${root}/.backend.pid;

cd ../frontend;

npm run dev & echo $! > ${root}/.frontend1.pid;
npm run dev:alt & echo $! > ${root}/.frontend2.pid;
