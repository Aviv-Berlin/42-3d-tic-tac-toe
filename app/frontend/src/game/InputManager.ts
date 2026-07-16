import { GameState } from "./GameState";

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
                this.game.moveCursor(true, "y");
                break;

            case "a":
                this.game.moveCursor(false, "y");
                break;

            case "w":
                this.game.moveCursor(true, "z");
                break;

            case "s":
                this.game.moveCursor(false, "z");
                break;

            case "e":
                this.game.moveCursor(true, "x");
                break;

            case "d":
                this.game.moveCursor(false, "x");
                break;

            case "Enter":
                this.game.placeSphere();
                break;
        }
    };
}