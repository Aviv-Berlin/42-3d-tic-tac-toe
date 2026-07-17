import { GridPosition, CellState } from "./Types"
import { Player } from "./Player";

export class AiPlayer extends Player {
    public yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean {
        setTimeout(() => {
            this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
        }, 500);
        return true;
    }

    public moveCursor(direction: boolean, plane:  "x" | "y" | "z"): void {
        return;
    }

    public choosePos(): void {
        return;
    }

}