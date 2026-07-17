import { GridPosition, CellState, points, PLAYER_STATES } from "./Types"
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
        let bestScore: number = -1;
        let bestPos: GridPosition | null = null;

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    if (BoardState[x][y][z] != CellState.Empty)
                        continue;
                    const pos: GridPosition = {x,y,z};
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
        // Winning is always the highest priority.
        if (myScore >= N)
            return 10000;

        let bestOpponentScore = 0;
        for (const opponent of PLAYER_STATES) {
            if (opponent === this.IAm)
                continue;
            const opponentScore = this.scorePos(boardState, pos, opponent, N);
            if (opponentScore > bestOpponentScore)
                bestOpponentScore = opponentScore;
        }
        if (bestOpponentScore >= N)
            return 5000 + myScore;


        // For ordinary moves, prefer our own progress,
        // while also considering dangerous opponent lines.
        return myScore * 3 + bestOpponentScore;
    }

    //this function give a score for each position on the board based on how many positions are fromt the same color (and if there are no position already taken by other player)
    private scorePos(boardState: CellState[][][], pos: GridPosition, player: CellState, N: number): number {
        let bestScore: number = 0;
        let i: number = 0;

        while (i < points.length) {
            const myColor = checkVector(boardState, pos, player, points[i]).length;
            const empty = checkVector(boardState, pos, 0, points[i]).length - 1;
            if (empty + myColor >= N && myColor > bestScore)
                bestScore = myColor;
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