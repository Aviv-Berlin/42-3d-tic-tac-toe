import { GameState } from "./GameState"
import { Player } from "./Player"

export class InputManager {
    private game: GameState;

    constructor(game: GameState) {
        this.game = game;
    }

    public registerEvents(): void {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    public unregisterEvents(): void {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    private handleKeyDown = (event: KeyboardEvent): void => {

        switch (event.key) {
            case "q":
                this.game.getCurrentPlayer().moveCursor(true, "y");
                break;

            case "a":
                this.game.getCurrentPlayer().moveCursor(false, "y");
                break;

            case "w":
                this.game.getCurrentPlayer().moveCursor(true, "z");
                break;

            case "s":
                this.game.getCurrentPlayer().moveCursor(false, "z");
                break;

            case "e":
                this.game.getCurrentPlayer().moveCursor(true, "x");
                break;

            case "d":
                this.game.getCurrentPlayer().moveCursor(false, "x");
                break;

            case "Enter":
                this.game.getCurrentPlayer().choosePos();
                break;
        }
    };
}