import { System } from "../../../ecs/system.js";

export class HealthBarRenderSystem extends System {
    constructor(em, ctx, cvs, camera) {
        super(em, ['position', 'health', 'circle', 'enabled']);
        this.cam = camera;
        this.ctx = ctx;
        this.cvs = cvs;
    }

    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position')
            const health = this.em.getComponent(entity, 'health')
            const circle = this.em.getComponent(entity, 'circle')

            const { x, y } = this.cam.worldToScreen(position.x, position.y);
            const radius = circle.radius * this.cam.zoom;

            this.renderHealthBar({ x, y }, radius, health.hp / health.maxHp);
        }
    }

    renderHealthBar(position, radius, health) {
        const healthAngle = health * Math.PI * 2;

        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, radius + 3 * this.cam.zoom, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2 * this.cam.zoom;
        this.ctx.stroke();

        if (health > 0) {
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, radius + 3 * this.cam.zoom, -Math.PI / 2, -Math.PI / 2 + healthAngle);
            this.ctx.strokeStyle = health > 0.5 ? "#0f0" : health > 0.25 ? "#ff0" : "#f00";
            this.ctx.lineWidth = 2 * this.cam.zoom;
            this.ctx.stroke();
        }
    }
}