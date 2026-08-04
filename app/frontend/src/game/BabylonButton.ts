import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { CameraManager } from "./CameraManager";




export function babylonButton(canvas: HTMLCanvasElement, type: string): () => void {

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  materials.applyLook(1);
  const camera = new CameraManager(scene, canvas);
  let board: Board; 
  switch (type) {
    
    case "three":
      board= new Board(3, scene, materials);  
      board.createBoardButton(3);
      camera.spinCamera(1);
      break;

    case "four":
      board= new Board(4, scene, materials);  
      board.createBoardButton(4);
      camera.spinCamera(1);
      break;

    case "five":
      board= new Board(5, scene, materials);  
      board.createBoardButton(5);
      camera.spinCamera(1);
      break;

    case "easy":
      board= new Board(3, scene, materials);  
      board.createStack(1);
      camera.spinCamera(1);
      break;

    case "medium":
      board= new Board(3, scene, materials);  
      board.createStack(2);
      camera.spinCamera(2);
      break;

    case "hard":
      board= new Board(3, scene, materials);  
      board.createStack(3);
      camera.spinCamera(2);
      break;

    default:
      board= new Board(3, scene, materials);  
      board.createBoardButton(4);
      break;
  }


  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    engine.stopRenderLoop();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}

