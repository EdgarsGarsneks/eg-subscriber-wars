import { System } from "../../../ecs/system.js";

export class ShieldRenderSystem extends System {
    
    constructor(entityManager, ctx, cvs, camera) {
        super(entityManager, ['position', 'shield', 'circle']);
        this.ctx = ctx;
        this.cvs = cvs;
        this.camera = camera;
    }

    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position');
            const shield = this.em.getComponent(entity, 'shield');
            const circle = this.em.getComponent(entity, 'circle');

            shield.duration -= dt;
            if (shield.duration <= 0) {
                this.em.removeComponent(entity, 'shield');
                continue; 
            }

            const { x, y } = this.camera.worldToScreen(position.x, position.y);
            const radius = (circle.radius + 10) * this.camera.zoom;

            if (shield && shield.active) {
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#00bfff';
                this.ctx.beginPath();
                this.ctx.arc(x,y, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

}