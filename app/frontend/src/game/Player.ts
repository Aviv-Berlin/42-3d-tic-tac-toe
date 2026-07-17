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
    abstract yourTurn(BoardState: CellState[][][], N: number): boolean;
    //abstract submitMove(BoardState: CellState[][][], N: number): GridPosition;
}