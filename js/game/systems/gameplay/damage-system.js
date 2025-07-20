import { System } from "../../../ecs/system.js";

export class DamageSystem extends System {
    constructor(entityManager) {
        super(entityManager);
        this.requiredComponents = ['health', 'damage', 'enabled'];
    }

    update(dt) {
        const entities = this.entities();

        for (const entity of entities) {
            const health = this.em.getComponent(entity, 'health')
            const damage = this.em.getComponent(entity, 'damage')

            health.hp -= damage.amount;
            
            if (health.hp <= 0) {
                this.em.addComponent(entity, 'dead', { killedBy: damage.owner });
            }

            // Remove damage after processing
            this.em.removeComponent(entity, 'damage'); 
        }
    }
}