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
            if (this.game.isCellEmpty(nextCursor)) {
                this.cursor = nextCursor;
                this.graphics.showPreview(this.cursor, this.IAm);
                return;
            }
        }
        //preivew will only move if there is a free cell in that direction.

    }

    public selectPos(pos: GridPosition): boolean {
        if (!this.myTurn)
            return false;

        if (!this.game.isCellEmpty(pos))
            return false;

        this.cursor = { ...pos };
        this.graphics.showPreview(this.cursor, this.IAm);

        return true;
    }

    public choosePos(): void {
        if (!this.myTurn)
            return;
        if (this.game.placeMove(this.cursor))
            this.myTurn = false;
    }


    private placeCursor(): void {
        while(!this.game.isCellEmpty(this.cursor)){
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