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

export type BabylonButtonType =
    | "three"
    | "four"
    | "five"
    | "easy"
    | "medium"
    | "hard";

export function babylonButton(canvas: HTMLCanvasElement, type: BabylonButtonType): () => void {

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  //const camera = new CameraManager(scene, canvas);
  const board = new Board(3, scene, materials);
  switch (type) {
    
    case "three":
      board.createBoard(3, 1);
      break;

    case "four":
      board.createBoard(4, 1);
      break;

    case "five":
      board.createBoard(5, 1);
      break;

    case "easy":
      board.createStack(1, 1);
      break;

    case "medium":
      board.createBoard(2, 1);
      break;

    case "hard":
      board.createBoard(3, 1);
      break;

  }
  //const board = new Board(gameData.size, scene, materials);



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

