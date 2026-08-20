#!/bin/bash

cd app/backend

npm run dev &

cd ../frontend

npm run dev1 &
npm run dev2 &
npm run dev3 &

wait
