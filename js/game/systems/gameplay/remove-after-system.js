import { System } from "../../../ecs/system.js";

export class RemoveEntityAfterSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['remove-after']);
    }

    /**
     * System is responsible for marking entity for deletion after given time frame.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const removeAfter = this.em.getComponent(entity, 'remove-after');
            
            removeAfter.elapsed += dt;

            if (removeAfter.elapsed >= removeAfter.duration) {
                this.em.removeComponent(entity, 'remove-after');
                this.em.addComponent(entity, 'delete');
            }
        }

    }

}