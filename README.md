# 42-3d-tic-tac-toe

3D Tic-Tac-Toe Web App

## Instructions

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

### Build the dist directory for the backend

From `app/backend`, run:
```bash
npm run build
```

This will run the TypeScript compiler and store the JavaScript files in the `dist/` directory.

### Build images and run containers (backend and database)

From `app`, run:
```bash
docker compose up --build
```

### Run frontend and backend on the host machine

From the root of the repository, run:
```bash
./run_dev.sh
```

This will run three instances of the frontend (`5173`, `5174`, `5175`)
