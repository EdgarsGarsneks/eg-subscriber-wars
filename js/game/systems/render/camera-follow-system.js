import { System } from "../../../ecs/system.js";

export class CameraFollowSystem extends System {
    constructor(entityManager, camera) {
        super(entityManager, ['position', 'camera-follow']);
        this.camera = camera;
    }

    update(dt) {
        for (const entity of this.entities()) {
            const position = this.em.getComponent(entity, 'position')
            const follow = this.em.getComponent(entity, 'camera-follow')

            if (follow) {
                // Update camera position to follow the entity
                this.camera.x = position.x - this.camera.width / 2 / this.camera.zoom;
                this.camera.y = position.y - this.camera.height / 2 / this.camera.zoom;
                break;
            }
        }
    }
}