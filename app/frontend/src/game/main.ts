import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "../../../backend/src/game/GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { Player } from "./Player"
import { AiPlayer } from "../../../backend/src/game/AIPlayer"
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../types/game";
import { WsMessage } from "../../../shared/messages"

interface ServerMessage {
  message: string;
  timestamp: number;
}

export function createBabylonGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {

  const ws = new WebSocket("ws://localhost:3001");
  ws.onopen = () => {
    console.log(`client connected to server.`);
    ws.send(`Hi from the client.`);
  };
  ws.onmessage = (event) => {
    const data: ServerMessage = JSON.parse(event.data);
    console.log(`Received message from server: ${data}`);
  };

  ws.onclose = () => {
    console.log('Disconnected from the server');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

//all these are the visual elements - so running by the browser
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);
  const board = new Board(gameData.size, scene, materials);
  const ui = new GameUI(scene, onExit, materials);
  const graphics = new GameGraphics(board, materials, camera);
  const gameID = 'xxx';

  //backend runs the GameState and AiPlayer

  //LocalPlayer is frontend
  const player = new LocalPlayer(gameData.player1.username, gameID, graphics);
  let player2: Player;
  if (gameData.player2.type === "ai")
    player2 = new AiPlayer(gameData.player2.username, gameID, graphics, gameData.level);
  else if (gameData.player2.type === "guest")
    player2 = new LocalPlayer(gameData.player2.username, gameID, graphics);
  else
    player2 = new AiPlayer("ai placeholder", gameID, graphics, 1);
  //input manager is also frontend
  const input = new InputManager(game, scene, board, camera);
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
    game.dispose();
    ui.dispose();
    input.unregisterEvents();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
