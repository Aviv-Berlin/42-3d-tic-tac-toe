# 42-3d-tic-tac-toe
A web-based multiplayer 3D Tic-Tac-Toe game built for the 42 Berlin ft_transcendence project. Developed in TypeScript, the game features real-time multiplayer gameplay on a three-dimensional board rendered directly in the browser.

## How to install

From the root of the repository run the script `install.sh`. It will run `npm run install` for both the frontend and the backend.

## How to setup the database

From the `app` directory run the script `setup_docker.sh`. It will prompt you to set up the variables necessary for running the Postgres database and the backend.

## How to run

From the root of the repository run the script `run.sh`. It will start one instance of the backend (port `3001`) and three instances of the frontend (ports `5173`, `5174` and `5175`).
