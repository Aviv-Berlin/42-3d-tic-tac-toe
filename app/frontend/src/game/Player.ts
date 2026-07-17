import { GameState } from "./GameState";
import { GameGraphics} from "./GameGraphics"
import { CellState, GridPosition } from "./Types"

export abstract class Player {
    public name;
    protected game;
    protected graphics;

    constructor(name: string, game: GameState, graphics: GameGraphics) {
        this.name = name;
        this.game = game;
        this.graphics = graphics;
        this.game.register(this);
    }
    abstract yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean;

    protected getRandomEmptyCell(boardState: CellState[][][], N: number): GridPosition {
        const emptyCells: GridPosition[] = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    const pos: GridPosition = {x,y,z};
                    if (boardState[x][y][z] === CellState.Empty)
                        emptyCells.push(pos);
                }
            }
        };
        const randomNumber = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomNumber];
    }
    //abstract submitMove(BoardState: CellState[][][], N: number): GridPosition;
}