import { GridPosition, CellState, points, PLAYER_STATES } from "../../../shared/game/Types.ts"
import { Player } from "../../../frontend/src/game/Player.ts";
import { GameState } from "./GameState.ts";
import { WsMessage, JoinGameMessage, MoveMessage, GameStartMessage, createGameStartMessage, CreateYourTurnMessage } from "../../../shared/messages.ts"
import { addGP } from "../../../shared/game/Utils.ts";

interface PositionScore {
    score: number;
    isWinner: boolean;
}

interface MoveScore {
    score: number;
    winsGame: boolean;
    blocksWin: boolean;
}

export class AiPlayer {
    private IAm: number = -1;
    private level: number;
    private game: GameState
    private name: string;
    private N: number;

    constructor(name: string, game: GameState, level: number, N: number) {
        this.name = name;
        this.level = level;
        this.game = game;
        this.N = N;
    }

    public handleMessage(message: WsMessage) {
        console.log("Received message:", message);
        switch (message.type) {
            case "game-start":
                this.IAm = message.payload.youAre;
                break;
			case "turn":
				if (this.IAm === message.payload.PlaysNow)
                    this.yourTurn(this.game.getBoardState(),this.N, PLAYER_STATES[this.IAm]);
                break;
            case "move":

                //this.switchPlayer();
                break;
            default:
                console.log(`Unknown message: ${message}`);
        }
    }

    public yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean {
        this.IAm = youAre;
        setTimeout(() => {
           switch(this.level) {
            case 1:
                this.playRandomMove(BoardState, N);
                break;

            case 2:
                if (Math.floor(Math.random() * 3) === 0)
                    this.playRandomMove(BoardState, N);
                else
                    this.playSmartMove(BoardState, N);
                break;

            case 3:
                this.playSmartMove(BoardState, N);
                break;

            default:
                this.playRandomMove(BoardState, N);
                break;
           }
        }, 500);
        return true;
    }

    private playSmartMove(BoardState: CellState[][][], N: number) {
        let bestScore: number = -1;
        const winningPositions: GridPosition[] = [];
        const blockingPositions: GridPosition[] = [];
        const bestPositions: GridPosition[] = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    if (BoardState[x][y][z] != CellState.Empty)
                        continue;
                    const pos: GridPosition = {x,y,z};
                    const result = this.scoreMove(BoardState, pos, N);
                    if (result.winsGame) {
                        winningPositions.push(pos);
                        continue;
                    }
                    if (result.blocksWin) {
                        blockingPositions.push(pos);
                        continue;
                    }
                    if (result.score > bestScore) {
                        bestScore = result.score;
                        bestPositions.length = 0;
                        bestPositions.push(pos);
                    }
                    else if (result.score === bestScore)
                        bestPositions.push(pos);
                }
            }
        }

        let candidates: GridPosition[];

        if (winningPositions.length > 0)
            candidates = winningPositions;
        else if (blockingPositions.length > 0)
            candidates = blockingPositions;
        else
            candidates = bestPositions;
        const randomIndex = Math.floor(Math.random() * candidates.length);
        this.game.placeMove(candidates[randomIndex]);
    }

    private scoreMove(boardState: CellState[][][], pos: GridPosition, N: number): MoveScore {
        let score = -1;
        if (boardState[pos.x][pos.y][pos.z] !== CellState.Empty)
            return { score, winsGame: false, blocksWin: false};

        const myScore = this.scorePos(boardState, pos, this.IAm, N);
        const emptyScore = this.scorePos(boardState, pos, 0, N);
        let bestOpponentScore = 0;
        let blocksWin = false;
        for (const opponent of PLAYER_STATES) {
            if (opponent === this.IAm || opponent === CellState.Empty)
                continue;
            const opponentScore = this.scorePos(boardState, pos, opponent, N);
            if (opponentScore.isWinner)
                blocksWin = true;
            if (opponentScore.score > bestOpponentScore)
                bestOpponentScore = opponentScore.score;
        }
        console.log("myScore=", myScore, ", emptyScore", emptyScore, ", opponent", bestOpponentScore, ", ", pos.x, ",", pos.y, ",", pos.z);
        const finalScore = Math.max(myScore.score, emptyScore.score);
        return { score: finalScore, winsGame: myScore.isWinner, blocksWin};
    }


    //this function give a score for each position on the board based on how many positions are from the same color (and if there are no position already taken by other player)
    private scorePos(boardState: CellState[][][], pos: GridPosition, player: CellState, N: number): PositionScore {
        let score: number = 0;
        let isWinner = false;

        for (const vec of points) {
            const line = this.getFullVector(boardState, pos, vec);
            if (line.length !== N)
                continue;
            if (player === CellState.Empty) {
                const emptyLine = line.every((linePos) =>
                boardState[linePos.x][linePos.y][linePos.z] === CellState.Empty);
                if (emptyLine)
                    score++;
                continue;
            }
            let playerCells = 0
            let lineIsBlocked = false;
            for (const linePos of line) {
                const cell = boardState[linePos.x][linePos.y][linePos.z];
                if (cell === player)
                    playerCells++;
                else if (cell !== CellState.Empty) {
                    lineIsBlocked = true;
                    break;
                }
            }

            if (lineIsBlocked)
                continue;
            //counting also the potential spot we're on
            playerCells++;
            if (playerCells === N)
                isWinner = true;
            else
                score += Math.pow(N, playerCells);
        }
        return {score, isWinner};
    }

    private getFullVector(boardState: CellState[][][], startPos: GridPosition, vec: GridPosition): GridPosition[] {
        const positions: GridPosition[] = [];
        let checkPos = {...startPos};
        //reach edge in one direction
        while (boardState[checkPos.x - vec.x]?.[checkPos.y - vec.y]?.[checkPos.z - vec.z] !== undefined) {
            checkPos = { x: checkPos.x - vec.x, y: checkPos.y - vec.y, z: checkPos.z - vec.z };
        }
        //collect all positions from edge until end
        while(boardState[checkPos.x]?.[checkPos.y]?.[checkPos.z] !== undefined) {
            positions.push({...checkPos});
            checkPos = addGP(checkPos,vec);
        }
        return positions;
    }

    private playRandomMove(BoardState: CellState[][][], N: number) {
        // this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
    }

    //these methods dont do anything, they are here in case input manager calls the ai player.
    public moveCursor(direction: boolean, plane:  "x" | "y" | "z"): void {
        return;
    }
    public choosePos(): void {
        return;
    }
    public selectPos(pos: GridPosition): boolean {
        return false;
    }

}
