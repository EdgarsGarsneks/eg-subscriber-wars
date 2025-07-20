import { System } from "../../../ecs/system.js";

export class RadarSystem extends System {
    constructor(em) {
        super(em, [ 'radar','position','enabled'])
    }

    /**
     * System scans for close entities which can later be used for controlling bot decisions.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const radar = this.em.getComponent(entity, 'radar')

            // Reset closest target for the current entity
            radar.closestTarget = { entity: null, distance: Infinity, position: null };
            radar.largestTarget = { entity: null, distance: Infinity, position: null };
            radar.closestPowerUp = { entity: null, distance: Infinity, position: null };
            radar.closestBullet = { entity: null, distance: Infinity, position: null };

            let largestRadius = 0;

            const position = this.em.getComponent(entity, 'position')
            const otherEntities = this.em.get('position').keys();
            
            for (const otherEntity of otherEntities) {
                if (otherEntity === entity || !this.em.hasComponent(otherEntity, 'enabled')) continue;
                const otherPosition = this.em.getComponent(otherEntity, 'position')
                const distance = Math.hypot(position.x - otherPosition.x, position.y - otherPosition.y);

                if (this.em.hasComponent(otherEntity, 'bullet') && distance < radar.closestBullet.distance) {
                    radar.closestBullet = { entity: otherEntity, distance, position: { x: otherPosition.x, y: otherPosition.y } };
                } else if (this.em.hasComponent(otherEntity, 'power-up') && distance < radar.closestPowerUp.distance) {
                    radar.closestPowerUp = { entity: otherEntity, distance, position: { x: otherPosition.x, y: otherPosition.y } };
                } else if (this.em.hasComponent(otherEntity, 'bot')) {
                    const botCircle = this.em.getComponent(otherEntity, 'circle');

                    if (botCircle.radius > largestRadius) {
                        radar.largestTarget = { entity: otherEntity, distance, position: { x: otherPosition.x, y: otherPosition.y } };
                    }

                    if (distance < radar.closestTarget.distance) {
                        radar.closestTarget = { entity: otherEntity, distance, position: { x: otherPosition.x, y: otherPosition.y } };
                    }
                }
            }
        }
    }
}