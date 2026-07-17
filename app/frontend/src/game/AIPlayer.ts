import { GridPosition, CellState } from "./Types"
import { Player } from "./Player";

export class AiPlayer extends Player {
    public yourTurn(BoardState: CellState[][][], N: number, youAre: CellState): boolean {
        setTimeout(() => {
            this.game.placeMove(this.getRandomEmptyCell(BoardState, N));
        }, 500);
        return true;
    }



}