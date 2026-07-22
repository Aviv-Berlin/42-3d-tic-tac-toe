import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ArcRotateCamera } from "@babylonjs/core"
import { Scene } from "@babylonjs/core"
import { Animation } from "@babylonjs/core/Animations/animation";


export class CameraManager {

    private readonly initialAlpha = Math.PI / 4;
    private readonly initialBeta = Math.PI / 3;
    private readonly initialRadius = 6;

    private camera: ArcRotateCamera;
    private canvas: HTMLCanvasElement;

    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 6, Vector3.Zero(), scene);
        this.camera.attachControl(this.canvas, true);
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

    
}