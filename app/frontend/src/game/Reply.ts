import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "./GameState";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { GameData } from "../types/game";


export function replyGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {

//all these are the visual elements - so running by the browser
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);
  const board = new Board(gameData.size, scene, materials);
  const ui = new GameUI(scene, onExit, materials, board);
  const graphics = new GameGraphics(board, materials, camera);

  //backend runs the GameState and AiPlayer
  const game = new GameState(gameData, ui, graphics, onExit, 2);
  game.startReply();

  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    game.dispose();
    ui.dispose();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
