# 42-3d-tic-tac-toe

3D Tic-Tac-Toe Web App

## Set up after backend containerization

Some environment variables have been changed, so you will need the next steps!

### Install packages

From the root of the repository, run:
```bash
./install.sh
```

### Create environment and secret files

From `app`, run:
```bash
./setup_docker.sh
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

### Run frontend (not containerized yet)

From the root of the repository, run:
```bash
./run.sh
```
