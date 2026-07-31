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


export function replayGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);
  const board = new Board(gameData.size, scene, materials);
  board.createBoard(1);
  const ui = new GameUI(scene, onExit, materials, board);
  const graphics = new GameGraphics(board, materials, camera);

  const replay = new Replay(gameData, ui, graphics, onExit);
  void replay.startReplay().catch((error: unknown) => {
    console.error("Replay failed", error);
  });

  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    replay.dispose();
    engine.stopRenderLoop();
    ui.dispose();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}



export class Replay {
    private boardState: CellState [][][] = [];
    private N: number;
    private ui: GameUI;
    private graphics: GameGraphics;
    private onExit: () => void; //this is a function that is called when game is 
    private exitTimeout: ReturnType<typeof setTimeout> | null = null;
    private gameData: GameData;
    private disposed = false;

  constructor(gameData: GameData, ui: GameUI, graphics: GameGraphics, onExit: () => void) {
    this.gameData = gameData;
    this.N = gameData.size;
    this.ui = ui;
    this.graphics = graphics;
    this.onExit = onExit;
    this.initBoard();
  }


  public async startReplay(): Promise<void> {
    const moves = this.gameData.moves;
    if (!moves || moves.length === 0) {
      console.warn("There are no moves to replay");
      return;
    }

    for (const move of moves) {
      if (this.disposed)
        return;
      let username: string;
      if (move.player === PLAYER_STATES[0])
        username = this.gameData.player1.username;
      else if (move.player === PLAYER_STATES[1])
        username = this.gameData.player2.username;
      else {
        console.warn("Unsupported player state in replay:", move.player);
        continue;
      }
      await this.ui.playerTitle(username);
      if (this.disposed)
        return;
      await delay(500);
      if (this.disposed)
        return;
      this.boardState[move.pos.x][move.pos.y][move.pos.z] = move.player;
      this.graphics.placeSphere(move.pos, move.player);
      await delay(500);
      if (this.disposed)
        return;
    }

    const winningPositions = checkWin(this.boardState,moves[moves.length -1].pos, moves[moves.length -1].player, this.N);
    if (winningPositions)
      this.graphics.animateWin(winningPositions);
    if (this.gameData.winner)
      this.ui.displayWinner(this.gameData.winner.username);
    else if (this.gameData.isDraw)
      await this.ui.displayDraw();
    else
      console.warn("Replay data has no winner and is not marked as a draw");
    if (this.disposed)
      return;
    this.exitTimeout = setTimeout(() => { this.onExit();}, 3000);
  }

  private initBoard() {
    for(let x = 0; x < this.N; x++) {
      this.boardState[x] = [];
        for(let y = 0; y < this.N; y++) {
          this.boardState[x][y] = [];
          for(let z = 0; z < this.N ; z++)
            this.boardState[x][y][z] = CellState.Empty;
        }
    }
  }

  public isCellEmpty(pos: GridPosition): boolean {
    return this.boardState[pos.x][pos.y][pos.z] === CellState.Empty;
  }

  public getCell(pos: GridPosition): CellState {
    return this.boardState[pos.x][pos.y][pos.z];
  }


  public dispose(): void {
    this.disposed = true;
    if (this.exitTimeout !== null) {
      clearTimeout(this.exitTimeout);
      this.exitTimeout = null;
    }  
  }


}
