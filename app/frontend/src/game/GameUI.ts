import { Scene } from "@babylonjs/core/scene";
import * as GUI from "@babylonjs/gui";

export class GameUI {

    private playerText: GUI.TextBlock;
    private instructions: GUI.TextBlock;
    private scene: Scene;
    
    constructor(scene: Scene) {
        this.scene = scene;
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        this.playerText = new GUI.TextBlock();
        this.playerText.color = "gray";
        this.playerText.fontSize = 50;
         this.playerText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.playerText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.playerText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.playerText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.playerText.paddingLeft = "40px";
        this.playerText.paddingTop = "40px";

        ui.addControl(this.playerText);

        this.instructions = new GUI.TextBlock();
        this.instructions.color = "gray";
        this.instructions.fontSize = 20;
         this.instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.paddingLeft = "40px";
        this.instructions.paddingBottom = "40px";

        this.instructions.text = "move with q,a,w,s,e,d, choose with Enter, reset with r";

        ui.addControl(this.instructions);
    }

    public playerTitle(player: string) {
        this.playerText.text = player;
    }

    public displayWinner(winner: string): void {
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("winnerUI", true, this.scene);

        const winnerText = new GUI.TextBlock();

        winnerText.text = `${winner} wins!`;
        winnerText.color = "gray";
        winnerText.fontSize = 150;
        winnerText.top = "0px";
        winnerText.left = "0px";

        ui.addControl(winnerText);
    }
}