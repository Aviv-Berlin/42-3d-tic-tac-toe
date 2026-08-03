import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { CellState, PLAYER_STATES, GridPosition } from "./Types";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { GameData } from "../types/game";
import { delay } from "./Utils";
import { checkWin } from "./GameCheckWin";



export function babylonButton(canvas: HTMLCanvasElement, type: string): () => void {

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  const renderEdges = materials.applyLook(1);
  new CameraManager(scene, canvas);
  let board: Board; 
  switch (type) {
    
    case "3":
      board= new Board(3, scene, materials);  
      board.createBoard(1);
      break;

    case "4":
      board= new Board(4, scene, materials);  
      board.createBoard(1);
      break;

    case "5":
      board= new Board(5, scene, materials);  
      board.createBoard(1);
      break;

    case "easy":
      board= new Board(3, scene, materials);  
      board.createStack(1, 1);
      break;

    case "medium":
      board= new Board(3, scene, materials);  
      board.createStack(2, 1);
      break;

    case "hard":
      board= new Board(3, scene, materials);  
      board.createStack(3, 1);
      break;

  }

    board.toggleCubeEdges(renderEdges);

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

