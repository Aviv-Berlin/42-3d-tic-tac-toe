import { GridPosition, CellState, points, PLAYER_STATES } from "./Types"
import { Player } from "./Player";
import { GameState } from "./GameState";
import { GameGraphics} from "./GameGraphics"
import { checkVector } from "./GameCheckWin";
import { addGP } from "./Utils";


export class AiPlayer extends Player {
    private IAm: CellState = 0;
    private level: number;
    
    constructor(name: string, game: GameState, graphics: GameGraphics, level: number) {
        super (name, game, graphics);
        this.level = level;
    }
    
    public yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean {
        this.IAm = youAre;
        setTimeout(() => {
           switch(this.level) {
            case 1:
                this.playRandomMove(BoardState, N);
                break;

            case 2:
                this.playRandomMove(BoardState, N);
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
        let bestPos: GridPosition | null = null;

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    if (BoardState[x][y][z] != CellState.Empty)
                        continue;
                    const pos: GridPosition = {x,y,z};
                    //const score = this.scoreMove(BoardState, pos, N);
                    const score = this.scoreMove(BoardState, pos, N);
                    if (score > bestScore) {
                        bestScore = score;
                        bestPos = pos;
                    }
                }
            }
        };
        if (bestPos !== null)
            this.game.placeMove(bestPos);
    }

    private scoreMove(boardState: CellState[][][], pos: GridPosition, N: number): number {
        const myScore = this.scorePos(boardState, pos, this.IAm, N);
        const emptyScore = this.scorePos(boardState, pos, 0, N);
        let bestOpponentScore = 0;
        for (const opponent of PLAYER_STATES) {
            if (opponent === this.IAm)
                continue;
            const opponentScore = this.scorePos(boardState, pos, opponent, N);
            if (opponentScore > bestOpponentScore)
                 bestOpponentScore = opponentScore;
        }
        console.log("myScore=", myScore, ", emptyScore", emptyScore, ", opponent", bestOpponentScore, ", ", pos.x, ",", pos.y, ",", pos.z);
        return emptyScore;
    }


    //this function give a score for each position on the board based on how many positions are fromt the same color (and if there are no position already taken by other player)
    private scorePos(boardState: CellState[][][], pos: GridPosition, player: CellState, N: number): number {
        let i: number = 0;
        let score: number = 0;

        while (i < points.length) {
            const myColor = checkVector(boardState, pos, player, points[i]).length;
            const empty = checkVector(boardState, pos, 0, points[i]).length - 1;
            //console.log("direction", i, "myColor", myColor, ", empty", empty);
            if (player === 0 && empty === N - 1)
                    score++;
            else if (player != 0 && myColor > 1 && myColor + empty === N)
                score += myColor;
            i++;
        }
        //console.log("score=", score, ", ", pos.x, ",", pos.y, ",", pos.z);
        return score;
    }

    private getFullVector(boardState: CellState[][][], startPos: GridPosition, vec: GridPosition): GridPosition[] {
        const positions: GridPosition[] = [];
        let checkPos = {...startPos};
        //reach edge in one direction
        while (boardState[checkPos.x - vec.x]?.[checkPos.y - vec.y]?.[checkPos.y - vec.y] !== undefined) {
            checkPos ={ x: checkPos.x - vec.x, y: checkPos.y - vec.y, z: checkPos.z - vec.z };
        }
        //collect all positions from edge until end
        while(boardState[checkPos.x]?.[checkPos.y]?.[checkPos.y] !== undefined) {
            positions.push(({...checkPos}));
            checkPos = addGP(checkPos,vec);
        }
        return positions;
    }

    private playRandomMove(BoardState: CellState[][][], N: number) {
        this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
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