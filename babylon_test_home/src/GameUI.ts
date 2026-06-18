import { Scene } from "@babylonjs/core/scene";
import * as GUI from "@babylonjs/gui";

export class GameUI {

    private playerText: GUI.TextBlock;
    private instructions: GUI.TextBlock;
    
    constructor(scene: Scene) {
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        this.playerText = new GUI.TextBlock();
        this.playerText.color = "gray";
        this.playerText.fontSize = 50;
        this.playerText.top = "-40%";
        this.playerText.left = "-40%";

        ui.addControl(this.playerText);

        this.instructions = new GUI.TextBlock();
        this.instructions.color = "gray";
        this.instructions.fontSize = 20;
        this.instructions.top = "40%";
        this.instructions.left = "-32%";
         this.instructions.text = "move with q,a,w,s,e,d, choose with Enter, reset with r";

        ui.addControl(this.instructions);
    }

    public playerTitle(player: string) {
        this.playerText.text = player;
    }
}