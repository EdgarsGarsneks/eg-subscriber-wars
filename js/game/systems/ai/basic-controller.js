import { System } from "../../../ecs/system.js";

export class BasicBotController extends System {

    constructor(entityManager) {
        super(entityManager, ['bot', 'radar', 'basic-controller', 'enabled']);
    }

    /**
     * Basic bot controller, it will follow and shoot closest target. 
     * If powerup is nearby will prioritize picking it up.
     */
    update(dt) {

        for (const entity of this.entities()) {
            const radar = this.em.getComponent(entity, 'radar');
            const targetPosition = { x: radar.closestTarget.position.x, y: radar.closestTarget.position.y }

            // If powerup is nearby, prefer to pick it up
            if (radar.closestPowerUp.entity && radar.closestPowerUp.distance < 400) {
                targetPosition.x = radar.closestPowerUp.position.x;
                targetPosition.y = radar.closestPowerUp.position.y;
            }

            if (Math.random() < 0.3) {
                this.em.addComponent(entity, 'shoot-at', { x: radar.closestTarget.position.x, y: radar.closestTarget.position.y });
            }
            this.em.addComponent(entity, 'move-to', { x: targetPosition.x, y: targetPosition.y });
        }
    }

}