import { GridPosition, CellState } from "./Types"
import { Player } from "./Player";

export class AiPlayer extends Player {
    public yourTurn(BoardState: CellState[][][], N: number): boolean {
        setTimeout(() => {
            this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
        }, 500);
        return true;
    }


    private getRandomEmptyCell(boardState: CellState[][][], N: number): GridPosition {
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
}