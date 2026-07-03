import { GameGraphics } from "./GameGraphics.ts";

export class InputManager{
    
    private graphics: GameGraphics;

    constructor(graphics: GameGraphics) {
        this.graphics = graphics;
    }

    public registerEvents(): void {
        window.addEventListener("keydown", (event) => {
            this.handleKeyDown(event);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "q":
                this.graphics.moveCursor(true, "y");
                break;
            case "a":
                this.graphics.moveCursor(false, "y");
                break;

            case "w":
                this.graphics.moveCursor(true, "z");
                break;

            case "s":
                this.graphics.moveCursor(false, "z");
                break;

            case "e":
                this.graphics.moveCursor(true, "x");
                break;

            case "d":
                this.graphics.moveCursor(false, "x");
                break;

            case "Enter":
                this.graphics.placeSphere();
                break;
            
            case "r":
                this.graphics.reset();
                break;
        }
    }
}