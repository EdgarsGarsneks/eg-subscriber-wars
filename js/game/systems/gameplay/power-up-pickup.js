import { System } from "../../../ecs/system.js";

export class PowerUpPickupSystem extends System {

    constructor(entityManager) {
        super(entityManager, ['power-up', 'enabled', 'collider', 'position']);
        this.em = entityManager;
    }

    /**
     * Handles powerup pickups by bots.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const collider = this.em.getComponent(entity, 'collider');
            const powerup = this.em.getComponent(entity, 'power-up');

            if (!collider.enabled) continue;

            const collidesWith = collider.collidesWith;
            for (const otherEntity of collidesWith) {
                if (this.em.hasComponent(otherEntity, 'bot')) {
                    this.handlePowerUpPickup(entity, powerup, otherEntity);
                    break; 
                }
            }
        }
    }

    handlePowerUpPickup(entity, powerup, bot) {
        powerup.onPickup(this.em, bot);

        this.em.removeEntity(entity);
    }
}