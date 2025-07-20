import { System } from "../../ecs/system.js";

export class EdgarsGarsneksAI extends System {

    constructor(entityManager) {
        super(entityManager, ['bot', 'radar', 'edgars-garsneks', 'enabled']);
    }

    update(dt) {
       for (const entity of this.entities()) {
            const radar = this.em.getComponent(entity, 'radar');

            const targetPosition = {
                x: radar.largestTarget.position.x + Math.random() * 30, 
                y: radar.largestTarget.position.y + Math.random() * 30
            }
          
            if (radar.closestPowerUp.entity && radar.closestPowerUp.distance < 400) {
                targetPosition.x = radar.closestPowerUp.position.x;
                targetPosition.y = radar.closestPowerUp.position.y;
            }

            this.em.addComponent(entity, 'shoot-at', {
                x: radar.closestTarget.position.x, 
                y: radar.closestTarget.position.y
            });

            this.em.addComponent(entity, 'move-to', {
                x: targetPosition.x,
                y: targetPosition.y
            });   
        }

    }


}