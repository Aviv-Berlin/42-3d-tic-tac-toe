import { Vector3} from "@babylonjs/core/Maths/math.vector";
import { ArcRotateCamera, Axis } from "@babylonjs/core"
import { Scene } from "@babylonjs/core"
import { Animation } from "@babylonjs/core/Animations/animation";
import { GridPosition } from "./Types";


export class CameraManager {

    private readonly initialAlpha = Math.PI / 4;
    private readonly initialBeta = Math.PI / 3;
    private readonly initialRadius = 6;

    private camera: ArcRotateCamera;
    private canvas: HTMLCanvasElement;

    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.camera = new ArcRotateCamera("camera", Math.PI / 3.99, Math.PI / 3, 6, Vector3.Zero(), scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.minZ = 0.05;
    }

    public resetCamera(): void {
    
    this.camera.detachControl();
    Animation.CreateAndStartAnimation("alphaAnim", this.camera, "alpha", 60, 30,
        this.camera.alpha, this.initialAlpha, Animation.ANIMATIONLOOPMODE_CONSTANT);

    Animation.CreateAndStartAnimation("betaAnim", this.camera, "beta", 60, 30,
        this.camera.beta, this.initialBeta, Animation.ANIMATIONLOOPMODE_CONSTANT);

    Animation.CreateAndStartAnimation("radiusAnim", this.camera, "radius", 60, 30,
        this.camera.radius, this.initialRadius, Animation.ANIMATIONLOOPMODE_CONSTANT);

    this.camera.setTarget(Vector3.Zero());


    setTimeout(() => {
        this.camera.attachControl(this.canvas, true);
    }, 500);
    }
    
    public getCamera(): ArcRotateCamera {
        return this.camera;
    }

//this function return the direction in relation to the screen and not absulote direction
    public getCameraDir(dir: Vector3): Vector3 {
        const camRight = this.camera.getDirection(Axis.X);
        const camUp = this.camera.getDirection(Axis.Y);
        const camFront = this.camera.getDirection(Axis.Z);

        const gridDirs = [
            new Vector3(1, 0, 0),   // 0: right
            new Vector3(-1, 0, 0),  // 1: left
            new Vector3(0, 1, 0),   // 2: up
            new Vector3(0, -1, 0),  // 3: down
            new Vector3(0, 0, 1),   // 4: forward
            new Vector3(0, 0, -1),  // 5: backward
        ];

        const matchIndex = gridDirs.findIndex((gridDir) => gridDir.equals(dir));
        let camDir: Vector3;

        switch (matchIndex) {
            case 0:
                camDir = camRight;
                break;

            case 1:
                camDir = camRight.scale(-1);
                break;

            case 2:
                camDir = camUp;
                break;

            case 3:
                camDir = camUp.scale(-1);
                break;

            case 4:
                camDir = camFront;
                break;

            case 5:
                camDir = camFront.scale(-1);
                break;

            default:
                return Vector3.Zero();
        }

        let best = gridDirs[0];
        let bestDot = -Infinity;

        for (const gridDir of gridDirs) {
            const dot = Vector3.Dot(camDir, gridDir);
            if (dot > bestDot) {
                bestDot = dot;
                best = gridDir;
            }
        }

        //console.log("Input direction:", dir.toString());
        //console.log("Camera direction:", camDir.toString());
        //console.log("Grid direction:", best.toString());

        return best.clone();
    }


}