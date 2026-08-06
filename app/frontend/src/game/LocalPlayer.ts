import { CellState, GridPosition } from "../../../shared/game/Types"
import { GameServerConnection } from "./GameServerConnection";
import { GameGraphics} from "./GameGraphics"


export class LocalPlayer {
    private myTurn: boolean = false;
    private cursor: GridPosition = {x: 0, y: 0, z: 0};
    private boardState: CellState[][][] | null = null;
    private N: number = 0;
    private IAm: CellState = CellState.Empty;
    private game: GameServerConnection;
    private graphics: GameGraphics;
    public readonly name: string;

    constructor(name: string, game: GameServerConnection, graphics: GameGraphics) {
        this.name = name;
        this.game = game;
        this.graphics = graphics;
    }

    public yourTurn(boardState: CellState[][][], N: number, youAre: CellState): boolean {
        this.boardState = boardState;
        this.N = N;
        this.IAm = youAre;
        this.cursor = {x: N - 1, y: N - 1, z: N -1};
        this.placeCursor();
        this.graphics.showPreview(this.cursor, this.IAm);
        this.myTurn = true;
        return true;
    }

    public moveCursor(direction: boolean, plane:  "x" | "y" | "z"): void {
        if (!this.myTurn)
            return;
        const movement = direction ? 1 : -1;
        const originalPos = this.cursor[plane];
        let nextPos = originalPos;

        for (let i = 0; i < this.N; i++) {
            nextPos = this.loopPlacement(originalPos + movement, this.N);
            const nextCursor: GridPosition = { ...this.cursor, [plane]: nextPos };
            if (this.boardState) {
                if (this.boardState[nextCursor.x][nextCursor.y][nextCursor.z] === CellState.Empty) {
                    this.cursor = nextCursor;
                    this.graphics.showPreview(this.cursor, this.IAm);
                    return;
                }
            }
        }
    }

    public selectPos(pos: GridPosition): boolean {
        if (!this.myTurn)
            return false;
        if (this.boardState && this.boardState[pos.x][pos.y][pos.z] !== CellState.Empty)
             return false;
        this.cursor = { ...pos };
        this.graphics.showPreview(this.cursor, this.IAm);
        return true;
    }

    public choosePos(): void {
        if (!this.myTurn)
            return;
        this.game.placeMove(this.cursor, this);
    }


    private placeCursor(): void {
        while(this.boardState && this.boardState && this.boardState[this.cursor.x][this.cursor.y][this.cursor.z] !== CellState.Empty){
            this.cursor.x--;

            if (this.cursor.x < 0) {
                this.cursor.x =  this.N - 1;
                this.cursor.y--;
            }

            if (this.cursor.y < 0) {
                this.cursor.y = this.N - 1;
                this.cursor.z--;
            }

            if (this.cursor.z < 0) {
                this.cursor.z = this.N - 1;
            }
        }

    }

    private loopPlacement(value: number, N: number): number {
        if (value >= N)
            return 0;
        if (value < 0)
            return N - 1;
        return value;
    }
}
