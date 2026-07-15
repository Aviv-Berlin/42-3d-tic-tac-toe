import { GameGraphics } from "./GameGraphics.ts";
import { GameState, CellState, type GridPosition } from "./GameState";


export class InputManager{
    
    private graphics: GameGraphics;
    private game: GameState;

    constructor(graphics: GameGraphics, game: GameState) {
        this.graphics = graphics;
        this.game = game;
    }

    public registerEvents(): void {
        window.addEventListener("keydown", (event) => {
            this.handleKeyDown(event);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
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
            
            case "r":
                this.graphics.reset();
                break;
        }
    }
}