import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameController } from "./GameController";
import { GameState } from "../../../backend/src/game/GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { Player } from "./Player"
import { AiPlayer } from "../../../backend/src/game/AIPlayer"
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../../../shared/game";
import { WsMessage } from "../../../shared/messages"
import { handleMessage } from "./socketHandlersFE";
import { createJoinGameMessage } from "../../../shared/messages"

export function createBabylonGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {

  //all these are the visual elements - so running by the browser
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const materials = new Materials(scene);
    const camera = new CameraManager(scene, canvas);
    const board = new Board(gameData.size, scene, materials);
    board.createBoard(1);
    const ui = new GameUI(scene, onExit, materials, board);
    const graphics = new GameGraphics(board, materials, camera);

  const gameController = new GameController(gameData, ui, graphics, 2);
  const player = new LocalPlayer(gameData.player1.username, gameController, graphics);
  gameController.register(player);

  const ws = new WebSocket("ws://localhost:3001");
  ws.onopen = () => {
    console.log(`client connected to server.`);
    ws.send(JSON.stringify(createJoinGameMessage(gameData)));
  };
  ws.onmessage = (event) => {
    const data: WsMessage = JSON.parse(event.data);
    console.log(`Received message from server: ${data}`);
    gameController.handleMessage(data);
  };

  ws.onclose = () => {
    console.log('Disconnected from the server');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };


  // let player2: Player;
  // if (gameData.player2.type === "ai")
  //   player2 = new AiPlayer(gameData.player2.username, game, graphics, gameData.level);
  // else if (gameData.player2.type === "guest")
  //   player2 = new LocalPlayer(gameData.player2.username, game, graphics);
  // else
  //   player2 = new AiPlayer("ai placeholder", game, graphics, 1);
  //input manager is also frontend
  const input = new InputManager(gameController, scene, board, camera);
  input.registerEvents();
  // game.register(player);
  // game.register(player2);
  // game.startGame();

  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    // game.dispose();
    ui.dispose();
    input.unregisterEvents();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
