import { System } from "../../../ecs/system.js";
import { BOT_BASE_HP, BOT_BASE_RADIUS } from "../../constants.js";

export class BotRespawnSystem extends System {

    constructor(em) {
        super(em, ['bot', 'position', 'respawn-timer', 'collider', 'health']);
    }

    /**
     * System for handling respawn. As soon as respawn timer elapses bot is being reset in the game.
     */
    update(dt) {
        const entities = [...this.entities()];

        for (const entity of entities) {
            const respawnTimer = this.em.getComponent(entity, 'respawn-timer');
            respawnTimer.elapsed += dt;

            if (respawnTimer.elapsed >= respawnTimer.duration) {
                this.em.removeComponent(entity, 'respawn-timer');
                this.em.addComponent(entity, 'enabled');

                const position = this.em.getComponent(entity, 'position');
                const circle = this.em.getComponent(entity, 'circle');
                const collider = this.em.getComponent(entity, 'collider');
                const health = this.em.getComponent(entity, 'health');

                collider.enabled = true;

                position.x = Math.random() * 4000; // Example respawn logic
                position.y = Math.random() * 4000; // Example respawn logic

                if (this.em.hasComponent(entity, 'subscriber')) {
                    health.hp = BOT_BASE_HP + 10;
                    health.maxHp = BOT_BASE_HP + 10;

                    circle.radius = BOT_BASE_RADIUS + 10;
                } else {
                    health.hp = BOT_BASE_HP;
                    health.maxHp = BOT_BASE_HP;

                    circle.radius = BOT_BASE_RADIUS;
                }


            }
        }
    }

}