export const createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("a", 0.2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene)

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);


    // The important part!!

    const gridSize = 4;
    const positionInGrid = BABYLON.Vector3.Zero();

    // The 6 grid directions you can step along
    const gridDirs = [
        new BABYLON.Vector3(1, 0, 0), new BABYLON.Vector3(-1, 0, 0),
        new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, -1, 0),
        new BABYLON.Vector3(0, 0, 1), new BABYLON.Vector3(0, 0, -1),
    ];

    // Return the grid axis (as integer x/y/z step) that best matches `dir`
    function snapToGrid(dir) {
        let best = gridDirs[0];
        let bestDot = -Infinity;
        for (const g of gridDirs) {
            const d = BABYLON.Vector3.Dot(dir, g);
            if (d > bestDot) { bestDot = d; best = g; }
        }
        return best;
    }

    function onKey(key) {
        const camRight = camera.getDirection(BABYLON.Axis.X);
        const camUp = camera.getDirection(BABYLON.Axis.Y);

        let step;
        switch (key) {
            case "ArrowRight": step = snapToGrid(camRight); break;
            case "ArrowLeft": step = snapToGrid(camRight.scale(-1)); break;
            case "ArrowUp": step = snapToGrid(camUp); break;
            case "ArrowDown": step = snapToGrid(camUp.scale(-1)); break;
            default: return;
        }

        // Apply and clamp inside the NxNxN cube (indices 0..gridSize)
        const next = positionInGrid.add(step);
        if (isInside(next)) positionInGrid.copyFrom(next);
    }

    function isInside(p) {
        return p.x >= 0 && p.x < gridSize && p.y >= 0 && p.y < gridSize && p.z >= 0 && p.z < gridSize;
    }

    scene.onKeyboardObservable.add((c) => {
        onKey(c.event.key);
        console.log(positionInGrid);
        sphere.position.copyFrom(positionInGrid);
    }, BABYLON.KeyboardEventTypes.KEYDOWN)

    return scene;
};