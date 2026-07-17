import { Player } from "./Player";
import { CellState, GridPosition } from "./Types"

export class LocalPlayer extends Player {
    private myTurn: boolean = false;
    private cursor: GridPosition = {x: 0, y: 0, z: 0};
    private boardState: CellState[][][] | null = null;
    private N: number = 0;
    private IAm: CellState = CellState.Empty;


    public yourTurn(boardState: CellState[][][], N: number, youAre: CellState): boolean {
        this.boardState = boardState;
        this.N = N;
        this.IAm = youAre;
        this.cursor = this.getRandomEmptyCell(boardState, N);
        this.graphics.showPreview(this.cursor, this.IAm);
        this.myTurn = true;
        return true;
    }

    public moveCursor(direction: boolean, plane:  "x" | "y" | "z"): void {
        if (!this.myTurn)
            return;
        const movement = direction ? 1 : -1;
        this.cursor[plane] = this.loopPlacement(this.cursor[plane] + movement, this.N);
        this.graphics.showPreview(this.cursor, this.IAm);

    }

    public choosePos(): void {
        if (!this.myTurn)
            return;
        this.game.placeMove(this.cursor);
    }


    private advanceCursor(N: number): void {
        this.cursor.x--;

        if (this.cursor.x < 0) {
            this.cursor.x =  N - 1;
            this.cursor.y--;
        }

        if (this.cursor.y < 0) {
            this.cursor.y = N - 1;
            this.cursor.z--;
        }

        if (this.cursor.z < 0) {
            this.cursor.z = N - 1;
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