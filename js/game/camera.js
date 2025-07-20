export class Camera {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.zoom = 1.0;
        this.followTarget = null;
        this.viewport = { width, height };
        this.dragging = false;
    }

    /**
     * Systems updates camera position so that following target is in the middle of the screen.
     */
    update(dt) {
        if (this.followTarget) {
            this.cam.x = this.followTarget.x - width / 2 / this.zoom;
            this.cam.y = this.followTarget.y - height / 2 / this.zoom;
        }
    }

    /**
     * Transforms given world coordinates to screen
     * @param {numer} x world x coordinate
     * @param {numer} y world y cooordinate
     * @returns {x, y} screen coordinates
     */
    worldToScreen(x, y) {
        return {
            x: (x - this.x) * this.zoom,
            y: (y - this.y) * this.zoom
        };
    }


    /**
     * Scales scalar value according to camera zoom.
     */
    scaleScalar(scalar) {
        return scalar * this.zoom;
    }

    /**
     * Transforms screen coordinates into world.
     */
    screenToWorld(x, y) {
        return {
            x: x / this.zoom + this.x,
            y: y / this.zoom + this.y
        };
    }

    /**
     * Change cameras zoom. Clamped between 0.5 and 5.
     */
    zoomIn(scale) {
        this.zoom = clamp((this.zoom || 1) * scale, 0.5, 5);
    }



}