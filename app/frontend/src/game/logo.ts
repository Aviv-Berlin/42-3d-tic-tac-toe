import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
//import { Board } from "./Board";
//import { CameraManager } from "./CameraManager";



export function babylonLogo(canvas: HTMLCanvasElement): ()=> void {

      const engine = new BABYLON.Engine(canvas, true);
      const scene = new BABYLON.Scene(engine);
      const materials = new Materials(scene);
      materials.applyLook(1);
      //const camera = new CameraManager(scene, canvas);
      //let board: Board;
      
      
    engine.runRenderLoop(() => {
    scene.render()
    })

    const resizeObserver = new ResizeObserver(() => {
        engine.resize()
    })

    resizeObserver.observe(canvas)

    return () => {
        resizeObserver.disconnect()
        engine.stopRenderLoop()
        scene.dispose()
        engine.dispose()
    }
}
