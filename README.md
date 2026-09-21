# 42-3d-tic-tac-toe

3D Tic-Tac-Toe Web App

## General Instructions

These steps are needed for running both in development mode (local) and in production (Docker containers).

### Install packages

From the root of the repository, run:
```bash
./install.sh
```

### Create environment and secret files

From the root of the repository, run:
```bash
./setup_env.sh
```

## Production Instructions

These steps are needed for running in production (Docker containers).

### Build the dist directory for the backend and the frontend

From the root of the repository, run:
```bash
./build.sh
```

### Build images and run containers

From the root of the repository, run:
```bash
./run_prod.sh
```

The app it's accessible at:

```bash
http://localhost:8080
```

## Development instructions

These steps are needed for running in development mode (local).

### Check database

Make sure that you have an instance of PostgreSQL running.

### Run frontend and backend on the host machine

From the root of the repository, run:
```bash
./run_dev.sh
```

This will run three instances of the frontend (`5173`, `5174`, `5175`)
