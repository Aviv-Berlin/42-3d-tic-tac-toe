import { PlacementManager } from "./PlacementManager";

export class InputManager{
    
    private place: PlacementManager;

    constructor(_place: PlacementManager) {
        this.place = _place;
    }

    public registerEvents(): void {
        window.addEventListener("keydown", (event) => {
            this.handleKeyDown(event);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "q":
                this.place.moveCursor(true, "y");
                break;
            case "a":
                this.place.moveCursor(false, "y");
                break;

            case "w":
                this.place.moveCursor(true, "z");
                break;

            case "s":
                this.place.moveCursor(false, "z");
                break;

            case "e":
                this.place.moveCursor(true, "x");
                break;

            case "d":
                this.place.moveCursor(false, "x");
                break;

            case "Enter":
                this.place.placeSphere();
                break;
        }
    }
}