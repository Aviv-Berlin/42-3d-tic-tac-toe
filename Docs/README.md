*This project has been created as part of the 42 curriculum by @akosloff, @smoon, @lhagemos, @sgaspari, and @hallison*

A web-based multiplayer 3D Tic-Tac-Toe game.

**Features:**
- User account creation & secure login
- Live online games (user vs. user, user vs. AI)
- Local games (two players at one screen)
- Customizable game settings (difficulty, board size, visual mode)
- User profile with recent game history, score and stats
- User settings page to manage account

**Requirements**
- Node.js
- npm
- Docker

## Instructions
To set-up, build and run the game:
`./run.sh`

This first time you run this script, you will be prompted to enter information required for SSL key & certification creation. Alternately, you may provide an existing key and certification here:

```
/secrets/ttt_nginx.crt
/secrets/ttt_nginx.key
```

