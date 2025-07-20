import { System } from "../../../ecs/system.js";
import { BOT_BASE_SPEED } from "../../constants.js";

export class MoveToTargetSystem extends System {

    constructor(entityManager) {
        super(entityManager, ['bot', 'position', 'velocity', 'move-to', 'enabled']);
    }

    /**
     * System for moving bot towards target position.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position');
            const velocity = this.em.getComponent(entity, 'velocity');
            const targetPosition = this.em.getComponent(entity, 'move-to');

            // Calculate direction towards the target
            const dx = targetPosition.x - position.x;
            const dy = targetPosition.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                velocity.vx = (dx / distance) * BOT_BASE_SPEED;
                velocity.vy = (dy / distance) * BOT_BASE_SPEED;
            }
        }
    }
}


