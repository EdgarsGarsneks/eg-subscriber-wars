import { System } from "../../../ecs/system.js";

export class MovementSystem extends System {

    constructor(em) {
        super(em, ['position', 'velocity', 'enabled']);
    }

    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position');
            const velocity = this.em.getComponent(entity, 'velocity');

            // Update position based on velocity
            position.x += velocity.vx * dt;
            position.y += velocity.vy * dt;
        }
    }
}