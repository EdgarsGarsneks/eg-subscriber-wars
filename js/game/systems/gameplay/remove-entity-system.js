import { System } from "../../../ecs/system.js";

export class RemoveEntitySystem extends System {
    constructor(entityManager) {
        super(entityManager, ['delete']);
    }

    /**
     * System that removes entities from game.
     */
    update(dt) {
        const entities = this.entities();

        for (const entity of entities) {
            this.em.removeEntity(entity);
        }

    }
}