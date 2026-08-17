# 42-3d-tic-tac-toe
A web-based multiplayer 3D Tic-Tac-Toe game built for the 42 Berlin ft_transcendence project. Developed in TypeScript, the game features real-time multiplayer gameplay on a three-dimensional board rendered directly in the browser.

## How to install

Run `npm install` both from `app/frontend` and `app/backend`.

## How to run

From the root of the repository run the script `run.sh`. It will start one instance of the backend (port `3001`) and two instances of the frontend (ports `5173` and `5174`).

## How to run the frontend in dev mode through Vite

Change to the `frontend` directory:

```bash
cd app/frontend
```

Install dependencies:

```bash
npm install
```

Run vite through the script:

```bash
npm run dev
```

The web app will be available locally at:

```bash
http://localhost:5173
```

To run a second instance on a different port:

```bash
npm run dev:alt
```

Available at:

```bash
http://localhost:5174
```

## How to run the backend

Change to the `backend` directory:

```bash
cd ../backend
```

Install dependencies:

```bash
npm install
```

Run node through the script:

```bash
npm run dev
```
