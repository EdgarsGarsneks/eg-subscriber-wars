import { System } from "../../../ecs/system.js";
import { TimerComponent } from "../../components/timer.js";
import { BULLET_BASE_RADIUS, BULLET_BASE_SPEED, BULLET_LIFETIME, POWERUP_BASE_RADIUS, POWERUP_MAX_ACTIVE, POWERUP_RESPAWN_TIME, WORLD_HEIGHT, WORLD_WIDTH } from "../../constants.js";

export class PowerUpSpawnSystem extends System {

    constructor(entityManager, maxPowerUps = POWERUP_MAX_ACTIVE, refreshRate = POWERUP_RESPAWN_TIME) {
        super(entityManager, ['power-up', 'enabled']);
        this.refreshRate = refreshRate;
        this.maxPowerUps = maxPowerUps;
        this.lastSpawnTime = 0;
        this.powerUps = [
            {
                name: 'bullet-pulse',
                color: '#ff6600',
                icon: '🔫',
                onPickup: (em, entity) => {
                    const bulletCount = 32; 
                    const position = this.em.getComponent(entity, 'position');
                    const color = this.em.getComponent(entity, 'color');

                    for (let i = 0; i < bulletCount; i++) {
                        const bullet = em.createEntity();
                        const angle = (Math.PI * 2 * i) / bulletCount;

                        em.addComponent(bullet, 'position', { x: position.x, y: position.y });
                        em.addComponent(bullet, 'circle', { radius: BULLET_BASE_RADIUS });
                        em.addComponent(bullet, 'collider', { enabled: true, collidesWith: [] });
                        em.addComponent(bullet, 'velocity', { vx: Math.cos(angle) * BULLET_BASE_SPEED, vy: Math.sin(angle) * BULLET_BASE_SPEED });
                        em.addComponent(bullet, 'bullet', { owner: entity });
                        em.addComponent(bullet, 'color', color)
                        em.addComponent(bullet, 'remove-after', new TimerComponent(BULLET_LIFETIME));
                        em.addComponent(bullet, 'enabled');
                    }
                }
            },
            {
                name: 'max-health',
                color: '#02fa0b',
                icon: '❤️',
                onPickup: (em, entity) => {
                    const healthComponent = em.getComponent(entity, 'health');
                    if (healthComponent.hp == healthComponent.maxHp) {
                        // If already max, add one more health
                        healthComponent.maxHp++;
                    }
                    healthComponent.hp = healthComponent.maxHp;
                }
            },
            {
                name: 'shield',
                color: '#00bfff',
                icon: '🛡️',
                onPickup: (em, entity) => {
                    const shieldComponent = em.getComponent(entity, 'shield');
                    if (shieldComponent) {
                        shieldComponent.active = true;
                        shieldComponent.duration = 5000;
                    } else {
                        em.addComponent(entity, 'shield', { active: true, duration: 5000 });
                    }
                }
            },
        ]
    }

    update(dt) {
        const entities = [...this.entities()];
        this.lastSpawnTime += dt;

        if (this.lastSpawnTime < this.refreshRate || entities.length >= this.maxPowerUps) {
            return;
        }

        const powerup = this.em.createEntity();
        const powerUpType = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];

        this.em.addComponent(powerup, 'power-up', powerUpType);
        this.em.addComponent(powerup, 'position', { x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT });
        this.em.addComponent(powerup, 'circle', { radius: POWERUP_BASE_RADIUS });
        this.em.addComponent(powerup, 'color', powerUpType.color);
        this.em.addComponent(powerup, 'collider', { enabled: true, collidesWith: [] });
        this.em.addComponent(powerup, 'enabled');

        this.lastSpawnTime = 0;
    }



}