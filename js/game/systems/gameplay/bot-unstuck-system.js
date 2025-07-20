import { System } from "../../../ecs/system.js";

export class BotUnstuckSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['bot', 'circle', 'collider']);
    }

    /**
     * System for preventing bots to move into each other.
     * It will check if bot is colliding with other bots and if so, it will spread them apart.
     */
    update(dt) {
        const entities = [...this.entities()];

        for (const entity of entities) {
            const collider = this.em.getComponent(entity, 'collider');
            const circle = this.em.getComponent(entity, 'circle');
            const position = this.em.getComponent(entity, 'position');

            if (!collider.enabled) { continue; }


            for (const other of collider.collidesWith) {
                if (!this.em.hasComponent(other, 'bot')) {
                    continue;
                }

                const otherCircle = this.em.getComponent(other, 'circle');
                const otherCollider = this.em.getComponent(other, 'collider');
                const otherPosition = this.em.getComponent(other, 'position');

                if (!otherCollider.enabled) { continue; }

                const dx = position.x - otherPosition.x;
                const dy = position.y - otherPosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = circle.radius + otherCircle.radius;

                if (distance < minDistance) {
                    const overlap = minDistance - distance;
                    const angle = Math.atan2(dy, dx);

                    position.x += Math.cos(angle) * overlap * 0.5;
                    position.y += Math.sin(angle) * overlap * 0.5;
                }

            }
        }
    }
}
