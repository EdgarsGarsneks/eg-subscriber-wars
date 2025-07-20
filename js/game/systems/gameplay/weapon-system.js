import { System } from "../../../ecs/system.js";

export class WeaponSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['bot', 'position', 'enabled', 'color', 'weapon', 'shoot-at']);
    }

    /**
     * System that is responsible for shooting at given target position.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position');
            const weapon = this.em.getComponent(entity, 'weapon');
            const targetPosition = this.em.getComponent(entity, 'shoot-at');
            const color = this.em.getComponent(entity, 'color')

            const dx = targetPosition.x - position.x;
            const dy = targetPosition.y - position.y;
            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (weapon.inRange(distance)) {
                weapon.shoot(this.em, position, angle, color, entity);
            }

            weapon.update(dt);

            this.em.removeComponent(entity, 'shoot-at')
        }
    }
}