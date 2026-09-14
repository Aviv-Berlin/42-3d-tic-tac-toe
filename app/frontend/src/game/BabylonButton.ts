import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { ButtonGraphics } from "./ButtonGraphics";
import { CameraManager } from "./CameraManager";




export function babylonButton(canvas: HTMLCanvasElement, type: string): () => void {

  const engine = new BABYLON.Engine(canvas, true);
  //engine.setHardwareScalingLevel(0.25);
  const scene = new BABYLON.Scene(engine);
  const materials = new Materials(scene);
  materials.applyLook(0);
  const camera = new CameraManager(scene, canvas);
  let graphics: ButtonGraphics; 
  switch (type) {
    
    case "three":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createBoardButton(3);
      camera.spinCamera(1);
      break;

    case "four":
      graphics = new ButtonGraphics(4, scene, materials);  
      graphics.createBoardButton(4);
      camera.spinCamera(1);
      break;

    case "five":
      graphics = new ButtonGraphics(5, scene, materials);  
      graphics.createBoardButton(5);
      camera.spinCamera(1);
      break;

    case "easy":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createStack(1);
      camera.spinCamera(1);
      break;

    case "medium":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createStack(2);
      camera.spinCamera(2);
      break;

    case "hard":
      graphics= new ButtonGraphics(3, scene, materials);  
      graphics.createStack(3);
      camera.spinCamera(4);
      break;

    case "logo":
      camera.setCameraPosition({alpha: 0, beta: Math.PI / 3.6})
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createLogo();
      camera.spinCamera(1);
      break;

    case "navbar":
      graphics = new ButtonGraphics(1, scene, materials);  
      graphics.createNavbar();
      camera.spinCamera(0.5);
      break;

    case "online":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createOnlineButton(type);
      camera.spinCamera(1);
      break;

    case "ai":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createOnlineButton(type);
      camera.spinCamera(1);
      break;

    case "local":
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createOnlineButton(type);
      camera.spinCamera(1);
      break;

    default:
      graphics = new ButtonGraphics(3, scene, materials);  
      graphics.createBoardButton(4);
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

