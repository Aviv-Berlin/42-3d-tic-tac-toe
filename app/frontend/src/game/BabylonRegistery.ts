import * as BABYLON from "@babylonjs/core";

interface babylonRun {
    id: number;
    name: string;
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
}

export class babylonRegistery {

    private static runs: babylonRun[] = [];
    private static nextId = 0;

    static add(name: string, canvas: HTMLCanvasElement,
        engine: BABYLON.Engine, scene: BABYLON.Scene): void {
        
        const id = this.nextId;
        this.nextId++;
        this.runs.push({id, name, canvas, engine, scene});
        console.log(`[Babylon] ${id}# created: ${name} | running: ${this.runs.length}`);
    }





}