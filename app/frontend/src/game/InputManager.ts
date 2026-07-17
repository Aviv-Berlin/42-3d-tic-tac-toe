import { LocalPlayer } from "./LocalPlayer"

export class InputManager {
    private player: LocalPlayer;

    constructor(player: LocalPlayer) {
        this.player = player;
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
                this.player.moveCursor(true, "y");
                break;

            case "a":
                this.player.moveCursor(false, "y");
                break;

            case "w":
                this.player.moveCursor(true, "z");
                break;

            case "s":
                this.player.moveCursor(false, "z");
                break;

            case "e":
                this.player.moveCursor(true, "x");
                break;

            case "d":
                this.player.moveCursor(false, "x");
                break;

            case "Enter":
                this.player.choosePos();
                break;
        }
    };
}