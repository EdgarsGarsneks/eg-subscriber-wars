import { System } from "../../../ecs/system.js";
import { TimerComponent } from "../../components/timer.js";
import { BULLET_BASE_DAMAGE } from "../../constants.js";

export class BulletCollisionSystem extends System {

    constructor(entityManager) {
        super(entityManager, ['bullet', 'color', 'collider', 'enabled', 'position']);
    }

    /**
     * System for handling bullet colisions.
     */
    update(dt) {
        const bullets = this.entities();

        for (const bulletId of bullets) {
            const bullet = this.em.getComponent(bulletId, 'bullet');
            const collider = this.em.getComponent(bulletId, 'collider')
            const position = this.em.getComponent(bulletId, 'position')
            const color = this.em.getComponent(bulletId, 'color');


            for (const otherEntity of collider.collidesWith) {
                if (otherEntity == bullet.owner) continue;

                // Bullet -> Bot
                if (this.em.hasComponent(otherEntity, 'bot')) {
                    if (!this.em.hasComponent(otherEntity, 'shield')) {
                        this.em.addComponent(otherEntity, 'damage', { amount: BULLET_BASE_DAMAGE, owner: bullet.owner });
                    }

                    this.createExplosion(position.x, position.y, color);
                    this.em.removeComponent(bulletId, 'enabled');
                    break;
                // Bullet -> Bullet
                } else if (this.em.hasComponent(otherEntity, 'bullet')) {
                    const otherBulletOwner = this.em.getComponent(otherEntity, 'bullet').owner;
                    const otherBulletColor = this.em.getComponent(otherEntity, 'color')

                    if (otherBulletOwner === bullet.owner) continue;

                    this.em.removeComponent(bulletId, 'enabled');
                    this.em.removeComponent(otherEntity, 'enabled');

                    this.createExplosion(position.x, position.y, color);
                    this.createExplosion(position.x, position.y, otherBulletColor);
                    break;
                }
            }

        }
    }

    createExplosion(x, y, color) {
        const particleCount = 6 + Math.floor(Math.random() * 8);
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.1 + 0.2; // Random speed between 0.5 and 1.0            
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const lifetime = Math.random() * 500 + 300; // Random lifetime between 500 and 1500 ms

            const particle = this.em.createEntity();

            this.em.addComponent(particle, 'position', { x, y });
            this.em.addComponent(particle, 'circle', { radius: 1 });
            this.em.addComponent(particle, 'color', color);
            this.em.addComponent(particle, 'velocity', { vx, vy });
            this.em.addComponent(particle, 'remove-after', new TimerComponent(lifetime));
            this.em.addComponent(particle, 'enabled');
        }
    }
}