import express from "express";
import game from '../controllers/gameController.ts';

const router = express.Router();

// [ Online lobby: view hosted matches, join a match, or create a match ]
// Event-stream endpoint (SSE) for clients to connect and receive updates
router.get('/online/lobby', game.lobby); 

// [ Join an existing hosted match ]
// Trigger route to push updates (SSE): 
// check here if Match is ready to start (required amount of players reached), if so, send event to all clients in the lobby (broadcast)
router.post('/online/lobby/join', game.joinMatch); 

// [ Host a new online match]
// API endpoit/trigger route to push updates (SSE):
// once the host has set the game settings and created the match, send event to all clients in the lobby (broadcast)
router.post('/online/lobby/host', game.createMatch); 

export default router;


// game-mode=online