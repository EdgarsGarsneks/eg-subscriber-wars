import { System } from "../../../ecs/system.js";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../../constants.js";

export class LimitsSystem extends System {
    constructor(entityManager) {
        super(entityManager, ['bot', 'position']);
    }

    /**
     * System is responsible for not letting bot out of the bounds.
     */
    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position');

            position.x = Math.max(0, Math.min(position.x, WORLD_WIDTH));
            position.y = Math.max(0, Math.min(position.y, WORLD_HEIGHT));
        }
    }
}