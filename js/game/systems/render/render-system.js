import { System } from "../../../ecs/system.js";

export class RenderSystem extends System {

    constructor(em, ctx, cvs, camera) {
        super(em, ['position', 'circle', 'enabled']);
        this.ctx = ctx;
        this.cvs = cvs;
        this.camera = camera;
        this.pulseTime = 0;
    }

    update(dt) {
        this.pulseTime += dt;
        this.drawBackground();

        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position')
            const circle = this.em.getComponent(entity, 'circle')
            const color = this.em.getComponent(entity,'color')

            const { x, y } = this.camera.worldToScreen(position.x, position.y);
            const radius = circle.radius * this.camera.zoom;

            if (x > this.cvs.width || x < 0 || y > this.cvs.height || y < 0) {
                continue;
            }

            if (this.em.hasComponent(entity, 'image')) {
                const image = this.em.getComponent(entity, 'image').img
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, Math.PI * 2);
                this.ctx.clip();
                this.ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
                this.ctx.restore();
            } else if (this.em.hasComponent(entity, 'power-up')) {
                // Calculate pulse size (0.8 to 1.2 times radius)
                const powerup = this.em.getComponent(entity, 'power-up');
                const pulseScale = 0.8 + Math.sin(this.pulseTime * 0.002) * 0.2;
                const displayRadius = radius * pulseScale * this.camera.zoom;

                // Draw outer circle
                this.ctx.beginPath();
                this.ctx.arc(x, y, displayRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = color + '33'; // Add 33 for 20% opacity
                this.ctx.fill();

                // Draw inner circle
                this.ctx.beginPath();
                this.ctx.arc(x, y, displayRadius * 0.7, 0, Math.PI * 2);
                this.ctx.fillStyle = color;
                this.ctx.fill();

                // Draw icon
                this.ctx.fillStyle = 'white';
                this.ctx.font = `${Math.floor(displayRadius)}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(powerup.icon, x, y);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = color;
                this.ctx.fill();
            }
        }
    }


    drawBackground() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.ctx.strokeStyle = '#24272d';
        this.ctx.lineWidth = 1 * this.camera.zoom;

        const step = 100;

        const startX = Math.floor(this.camera.x / step) * step;
        const endX = this.camera.x + this.cvs.width / this.camera.zoom;

        for (let x = startX; x < endX; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo((x - this.camera.x) * this.camera.zoom, 0);
            this.ctx.lineTo((x - this.camera.x) * this.camera.zoom, this.cvs.height);
            this.ctx.stroke();
        }

        const startY = Math.floor(this.camera.y / step) * step;
        const endY = this.camera.y + this.cvs.height / this.camera.zoom;

        for (let y = startY; y < endY; y += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, (y - this.camera.y) * this.camera.zoom);
            this.ctx.lineTo(this.cvs.width, (y - this.camera.y) * this.camera.zoom);
            this.ctx.stroke();
        }
    }

}