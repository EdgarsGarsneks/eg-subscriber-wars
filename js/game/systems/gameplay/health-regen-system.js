import { System } from "../../../ecs/system.js";

export class HealthRegenSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['health', 'regen']);
    }

    /**
     * Health regeneration system that restores health over time.
     * It checks if the entity has taken damage in the last 5 seconds,
     * if not, it regenerates health slowly.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const health = this.em.getComponent(entity, 'health');
            const regen = this.em.getComponent(entity, 'regen')

            if (this.em.hasComponent(entity, 'damage')) {
                regen.timeSinceLastDamage = 0;
            }

            regen.timeSinceLastDamage += dt;

            if (regen.timeSinceLastDamage < 5000) continue;

            health.hp = Math.min(health.maxHp, health.hp + 0.0005 * dt);
        }
    }
}
