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

    public add(name: string, canvas: HTMLCanvasElement,
        engine: BABYLON.Engine, scene: BABYLON.Scene): void {

        babylonRegistery.nextId++;
        const id = babylonRegistery.nextId;
        babylonRegistery.runs.push({id, name, canvas, engine, scene});
        console.log(`[Babylon] #${id} created: ${name} | running: ${babylonRegistery.runs.length}`);
    }

    public dispose(engine: BABYLON.Engine): void {
        const run = babylonRegistery.runs.find(run => run.engine === engine);

        if (!run) {
            console.warn("[Babylon] Engine not registered");
            return;
        }

        run.scene.dispose();
        run.engine.dispose();

        babylonRegistery.runs = babylonRegistery.runs.filter(current => current.engine !== engine);
        console.log(`[Babylon] disposed: #${run.id} ${run.name} | running: ${babylonRegistery.runs.length}`);
    }


    public print(): void {
        console.table(babylonRegistery.runs.map((runs, index) =>
            ({index, id: runs.id, name: runs.name, canvas: runs.canvas.id,})));
    }

    public count() {
        return babylonRegistery.runs.length;
    }

}