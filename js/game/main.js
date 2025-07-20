import { World } from "./world.js";

window.onload = function () {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const world = new World();

    window.world = world;

    world.init(ctx, canvas);

    const loop = (timestamp) => {
        const dt = timestamp - (this.lastTimestamp || timestamp);
        this.lastTimestamp = timestamp;

        world.update(dt);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}