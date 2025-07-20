import { System } from "../../../ecs/system.js";
import { TimerComponent } from "../../components/timer.js";

export class OnBotDeath extends System {
    constructor(entityManager) {
        super(entityManager, ['bot', 'dead', 'collider']);
    }

    /**
     * Handles bot dead event. 
     * When bot dies statistics are updated, collider is disabled and respawn timer is added.
     */
    update(dt) {
        const deadBots = this.entities();

        for (const bot of deadBots) {
            const dead = this.em.getComponent(bot, 'dead');
            const stats = this.em.getComponent(bot, 'bot').statistics
            
            const killedBy = dead.killedBy;
            const killerStats = this.em.getComponent(killedBy, 'bot').statistics
            
            stats.deaths++;
            stats.killsSinceLastDeath = 0;

            killerStats.kills++;
            killerStats.killsSinceLastDeath++;

            this.em.getComponent(bot, 'collider').enabled = false; 
            this.em.removeComponent(bot, 'dead');
            this.em.removeComponent(bot, 'enabled');

            this.em.addComponent(bot, 'respawn-timer', new TimerComponent(5000)); 
        }

    }
}