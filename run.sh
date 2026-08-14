#!/bin/bash

cd app/backend

npm run dev &

cd ../frontend

npm run dev &
npm run dev:alt &

wait
