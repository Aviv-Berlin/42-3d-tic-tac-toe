import { GridPosition, CellState, points } from "./Types"
import { Player } from "./Player";
import { checkVector } from "./GameCheckWin";

export class AiPlayer extends Player {
    private IAm: CellState = 0;

    public yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean {
        this.IAm = youAre;
        setTimeout(() => {
            //this.playRandomMove(BoardState, N);
            this.playSmartMove(BoardState, N);
        }, 500);
        return true;
    }

    private playSmartMove(BoardState: CellState[][][], N: number) {
        let bestScore: number = 0;
        let bestPos: GridPosition | null = null;

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    if (BoardState[x][y][z] != CellState.Empty)
                        continue;
                    const pos: GridPosition = {x,y,z};
                    const score = this.scorePos(BoardState, pos, this.IAm, N);
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

    //this function give a score for each position on the board based on how many positions are fromt the same color (and if there are no position already taken by other player)
    private scorePos(boardState: CellState[][][], pos: GridPosition, player: CellState, N: number): number {
        let bestScore: number = 0;
        let i: number = 0;

        while (i < points.length) {
            const myColor = checkVector(boardState, pos, player, points[i]).length;
            const empty = checkVector(boardState, pos, 0, points[i]).length - 1;
            if (empty + myColor >= N && myColor > bestScore)
                bestScore += myColor;
            i++;
        }

        return bestScore;
    }

    private playRandomMove(BoardState: CellState[][][], N: number) {
        this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
    }

    public moveCursor(direction: boolean, plane:  "x" | "y" | "z"): void {
        return;
    }

    public choosePos(): void {
        return;
    }

}