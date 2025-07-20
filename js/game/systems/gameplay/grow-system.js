import { System } from "../../../ecs/system.js";

export class GrowSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['dead']);
    }

    /**
     * Growth system handles transfer of size after bot got killed.
     * If bot killed was smaller it increases size by 1, 
     * If larger it overtakes the largest size.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const dead = this.em.getComponent(entity, 'dead');
            const killer = dead.killedBy;

            const victimCircle = this.em.getComponent(entity, 'circle');
            const victimHealth = this.em.getComponent(entity, 'health');            

            const killersHealth = this.em.getComponent(killer, 'health');
            const killersCircle = this.em.getComponent(killer, 'circle');
                //0.3
            killersHealth.maxHp = Math.max(killersHealth.maxHp + 1, victimHealth.maxHp + 1);
            killersCircle.radius = Math.max(killersCircle.radius + 1, victimCircle.radius + 1);

            killersHealth.hp = Math.min(killersHealth.hp * 1.10, killersHealth.maxHp);
        }
    }
}