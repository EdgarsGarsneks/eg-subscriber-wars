import { System } from "../../../ecs/system.js";

export class CollisionSystem extends System {
    constructor(em) {
        super(em, ['position', 'collider', 'enabled', 'circle']);
    }

    /**
     * System for handling collisions between entities.
     */
    update(dt) {
        const entities = [...this.entities()];
        for (const entity of entities) {
            const collider = this.em.getComponent(entity, 'collider')
            collider.collidesWith = [];
        }

        for (var i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const position = this.em.getComponent(entity, 'position');
            const collider = this.em.getComponent(entity, 'collider');
            const circle = this.em.getComponent(entity, 'circle');

            if (!collider.enabled) continue;

            for (var j = i + 1; j < entities.length; j++) {
                const otherEntity = entities[j];
                const otherPosition = this.em.getComponent(otherEntity, 'position')
                const otherCollider = this.em.getComponent(otherEntity, 'collider')
                const otherCircle = this.em.getComponent(otherEntity, 'circle')

                if (!otherCollider.enabled) continue;

                const dx = position.x - otherPosition.x;
                const dy = position.y - otherPosition.y;
                const distanceSquared = dx * dx + dy * dy;
                const radiusSum = circle.radius + otherCircle.radius;

                if (distanceSquared < radiusSum * radiusSum) {
                    collider.collidesWith.push(otherEntity);
                    otherCollider.collidesWith.push(entity);
                }
            }
        }
    }
}