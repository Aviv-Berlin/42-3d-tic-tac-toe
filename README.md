*This project has been created as part of the 42 curriculum by @akosloff, @hallison, @lhagemos, @sgaspari, and @smoon.*

# 3D Tic-Tac-Toe

## Description

3D Tic-Tac-Toe is a web-based multiplayer game that expands traditional Tic-Tac-Toe into a three-dimensional board.

The project combines an interactive 3D game with a complete web application. Users can create accounts, play locally or online, compete against an AI opponent, customize game visuals, review statistics, and watch replays of previous games.



### Key Features

- User registration and secure login
- Online multiplayer games
- Local two-player games
- Games against an AI opponent
- Three AI difficulty levels
- Real-time communication using WebSockets
- Online game lobby and matchmaking
- Interactive 3D game board
- Multiple board sizes
- Customizable visual styles
- Mouse and keyboard controls
- User profiles
- Match history
- Game statistics
- Player scores and rankings
- Account settings
- Support for multiple browsers



## Instructions
To set-up, build and run the game:
`./run.sh`

This first time you run this script, you will be prompted to enter information required for SSL key & certification creation. Alternately, you may provide an existing key and certification here:

```
/secrets/ttt_nginx.crt
/secrets/ttt_nginx.key
```

**Requirements**
- Node.js
- npm
- Docker

## Project Management

The project was developed collaboratively by a team of five. We had weekly in-person meetings to discuss progress and goals, make decisions, and distribute and coordinate the work. Between meetings, we communicated through our Slack channel.
Work was divided between frontend development, backend development, database design, infrastructure, networking, and game development. Larger features such as online multiplayer required collaboration between several team members.
We used Git and GitHub branches to develop individual features. Changes were integrated into the main branch through pull requests, which required review and approval by at least one other team member.

### Team Roles

| Team Member | Role |
|---|---|
| @akosloff | Product Owner / Frontend Developer |
| @hallison | Backend / Security / DevOps Developer |
| @lhagemos | Backend / Full-Stack Developer |
| @sgaspari | Project Manager / Frontend / DevOps Developer |
| @smoon | Backend Developer |

*Tech Lead was a shared responsibility, as technical decisions were made by the entire team.*

### Tools and Communication

- Git
- GitHub
- Feature branches and pull requests
- GitHub issues
- Slack

---

## Technical Stack

### Frontend

#### React

React is used as the main frontend framework. It allows the application to be divided into reusable components and provides a structured way to manage UI state and user interaction.

#### TypeScript

TypeScript provides static typing across the application and helps define clear interfaces between frontend components, backend APIs, WebSocket messages, and game logic.

#### Tailwind CSS

Tailwind CSS is used for the web application's interface styling and helps maintain consistent layouts and visual rules across components.

#### Babylon.js

Babylon.js is used to create and render the interactive 3D game environment.

It provides functionality for:

- 3D meshes
- Cameras
- Lighting
- Materials
- Animations
- Mouse interaction
- Scene management
- Rendering

Babylon.js was chosen because the project requires a fully interactive 3D environment rather than a traditional 2D HTML board.

### Backend

#### Node.js

Node.js provides the JavaScript runtime for the backend.

Using JavaScript and TypeScript across both frontend and backend simplifies communication between different parts of the application.

#### Express

Express is used as the backend framework.

It was chosen because it is lightweight, widely used, well documented, and provides a straightforward way to implement REST API endpoints and middleware.

The backend handles:

- Authentication
- User information
- Settings
- Match information
- Statistics
- Lobby functionality
- Multiplayer games

### Real-Time Communication

#### WebSockets

WebSockets provide persistent two-way communication between clients and the server.

They are used for:

- Online games
- Player moves
- Game-state synchronization
- Player connection and disconnection
- Match state
- Waiting rooms

This allows both players to receive game updates immediately.

### Database

#### PostgreSQL

PostgreSQL is used as the application's relational database.

It was chosen because the project has clear relationships between users, matches, and moves, and requires reliable structured data storage.

#### ORM

Drizzle ORM is used for part of the database layer. It provides a structured abstraction for database access and reduces repetitive SQL code.

### Infrastructure

#### Docker

Docker is used to containerize the application and provide a predictable runtime environment.

#### Nginx

Nginx is used as the web server and reverse proxy and handles HTTPS communication.

---

## Database Schema

The database is organized around three main tables:

- `users`
- `matches`
- `moves`

### `users`

Stores registered users and game-related statistics.

| Field | Type | Description |
|---|---|---|
| `id` | `serial` | Primary key |
| `username` | `text` | Unique username |
| `email` | `text` | Unique email address |
| `pw_hash` | `text` | Hashed password |
| `last_seen` | `timestamptz` | Time the user was last active |
| `full_score` | `int` | Overall player score |
| `online_score` | `int` | Score from online matches |

Passwords are never stored directly. Only a password hash is stored in `pw_hash`.

### `matches`

Stores information about each game.

| Field | Type | Description |
|---|---|---|
| `id` | `serial` | Primary key |
| `player1` | `int` | First player |
| `player2` | `int` | Second player |
| `difficulty` | `enum` | AI difficulty where applicable |
| `winner` | `int` | Winning player |
| `started_at` | `timestamptz` | Time the game started |
| `ended_at` | `timestamptz` | Time the game ended |
| `board_size` | `int` | Size of the 3D board |

`player1`, `player2`, and `winner` reference users stored in the `users` table.

### `moves`

Stores the individual moves performed during a match.

| Field | Type | Description |
|---|---|---|
| `move_nr` | `int` | Sequential move number |
| `match_id` | `int` | Match the move belongs to |
| `coord_x` | `int` | X coordinate |
| `coord_y` | `int` | Y coordinate |
| `coord_z` | `int` | Z coordinate |
| `player` | `int` | Player who performed the move |
| `played_at` | `timestamptz` | Time the move was made |

`match_id` references `matches.id`, while `player` references `users.id`.

The combination of `match_id` and `move_nr` identifies the position of a move within a match.

Because every move is stored, completed games can be reconstructed move by move.

### Relationships

```text
users
  │
  ├──── player1 ─────┐
  ├──── player2 ─────┤
  └──── winner ──────┤
                     ▼
                  matches
                     │
                     │ match_id
                     ▼
                   moves
                     │
                     │ player
                     └──────────────► users
```

A user can participate in many matches. A match can contain many moves. Each move belongs to one match and records which player performed it.

---

## Features

### Authentication

Users can create accounts and securely authenticate with the application.

Includes:

- Registration
- Login
- Password hashing
- Authentication
- Logout

### Online Multiplayer

Two users on separate computers can play the same game in real time.

The server manages the shared game state and distributes updates between clients using WebSockets.

### Local Multiplayer

Two players can play on the same computer without requiring a second network connection.

### AI Opponent

Users can play against a computer-controlled opponent with three difficulty levels.

At higher difficulty levels, available board positions are evaluated and assigned scores based on the current game state. This allows the AI to identify winning opportunities, strong positions, opponent threats, and moves that should be blocked.

### 3D Game

The game is rendered using Babylon.js and includes:

- 3D game board
- Player move meshes
- Materials
- Cameras
- Animations
- Mouse controls
- Keyboard controls
- Visual feedback
- Multiple visual styles

### Game Lobby

The lobby allows players to create, find, and join online games.

Real-time communication allows lobby changes to appear without manually refreshing the page.

### Match History

Completed matches are stored in the database and can be reviewed by users.

Because individual moves are also stored, games can be reconstructed from the database.

### Statistics and Ranking

The application tracks player performance across multiple matches and uses stored results to calculate scores and rankings.

### Game Customization

Players can customize:

- Board size
- AI difficulty
- Visual style

### Browser Support

The application was tested and debugged on:

- Google Chrome
- Mozilla Firefox
- Brave

---

## Modules

The project implements the following modules from the ft_transcendence subject.

### Major — Frontend and Backend Frameworks

**Points: 2**

The project uses React for the frontend and Express for the backend.

React provides reusable and stateful UI components, while Express provides a lightweight and well-supported foundation for the application's backend and REST API.

**Main contributor:** @sgaspari  
**Additional contributors:** Team

### Major — Real-Time Features

**Points: 2**

WebSockets are used for online gameplay, player moves, game-state synchronization, player connections, waiting rooms, and lobby communication.

**Main contributors:** @lhagemos, @smoon

### Minor — ORM

**Points: 1**

An ORM is used as part of the backend database layer to provide structured access to relational data.

**Main contributor:** @smoon

### Minor — Additional Browser Support

**Points: 1**

The application was tested and debugged on Chrome, Firefox, and Brave.

**Contributors:** Entire team

### Minor — Game Statistics and Match History

**Points: 1**

Completed matches and individual moves are stored in the database and used for match history, player statistics, scores, rankings, and game reconstruction.

**Main contributor:** @smoon

### Major — AI Opponent

**Points: 2**

The project includes a custom AI opponent with three difficulty levels.

The AI evaluates available positions and assigns scores based on the current game state, allowing it to recognize strong moves, winning opportunities, and opponent threats.

**Main contributor:** @akosloff

### Major — Complete Web-Based Game

**Points: 2**

The project implements a complete web-based game developed by the team, including game logic, user interaction, multiplayer integration, and the full game experience.

**Contributors:** Entire team

### Major — Remote Players

**Points: 2**

Two users on separate computers can participate in the same game in real time.

The backend maintains the shared game state while WebSockets distribute moves and game events between connected clients.

**Main contributors:** @lhagemos, @smoon, @akosloff

### Major — Advanced 3D Graphics

**Points: 2**

Babylon.js is used to create the interactive 3D environment, including game boards, player meshes, materials, cameras, animations, object selection, and visual game-state feedback.

**Main contributor:** @akosloff

### Module Point Calculation

| Module | Type | Points |
|---|---|---:|
| Frontend and backend frameworks | Major | 2 |
| Real-time WebSocket features | Major | 2 |
| ORM | Minor | 1 |
| Additional browser support | Minor | 1 |
| Game statistics and match history | Minor | 1 |
| AI opponent | Major | 2 |
| Complete web-based game | Major | 2 |
| Remote players | Major | 2 |
| Advanced 3D graphics | Major | 2 |
| **Total** |  | **15** |

---

## Resources

Babylon.js:
https://doc.babylonjs.com/
https://playground.babylonjs.com
https://www.youtube.com/watch?v=e6EkrLr8g_o

React:
https://www.helsinki.fi/en/admissions-and-education/open-university/multidisciplinary-themed-modules/full-stack
https://react.dev/

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express Documentation](https://expressjs.com/)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Use of AI

AI tools were used as supporting tools during development for:

- Explaining unfamiliar APIs and programming concepts
- Debugging error messages and logs
- Explaining Babylon.js, React, TypeScript, WebSockets, SQL, and backend concepts
- Suggesting edge cases for testing

The architecture, implementation decisions, integration, testing, and final code remained the responsibility of the project team.

---

## Individual Contributions

### Aviv Kosloff — @akosloff

Product Owner and game developer. Designed and implemented the Babylon.js 3D game, including core gameplay, UX, mouse and keyboard controls, camera behavior, player-move visualization, and game-state logic. Developed the AI opponent and its three difficulty levels, and worked on frontend/backend game integration, gameplay debugging, and visual improvements.

### Hillary Alison — @hallison

Focused on authentication, security, and infrastructure. Developed token handling and validation, backend authentication middleware, protected frontend routes, and server-level redirects. Containerized the database, created the initial Docker Compose and environment/secrets setup, improved database-query security, automated SSL certificate generation and secret storage, contributed to UI and board design, and reviewed and debugged pull requests.

### Lea Hagemoser — @lhagemos

Worked across backend, database, and real-time communication. Set up the server and environment configuration, implemented WebSocket communication and the shared connection provider, and created the database schema and initial setup. Developed authentication, lobby, and settings endpoints, and worked on matchmaking, match creation and joining, and real-time lobby communication.

### Simone Gaspari — @sgaspari

Project Manager, frontend, and DevOps developer. Built the React and Tailwind CSS interface and developed reusable frontend components. Wrote Bash scripts to automate installation and application startup, containerized the frontend and backend using Docker, and worked on container integration, application setup, and general frontend implementation across the project.

### Steven Moon — @smoon

Focused on backend, multiplayer, and data-layer functionality. Worked on WebSockets and backend game logic, developed SQL queries and ORM integration, and implemented the ranking and scoring system. Configured Nginx, contributed general debugging and bug fixes across the project, and created the project's logo.


