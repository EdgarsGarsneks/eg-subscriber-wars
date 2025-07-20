import { System } from "../../../ecs/system.js";

export class DebugEntitySystem extends System {
    constructor(em, ctx, cvs) {
        super(em, ['debug']);
        this.ctx = ctx;
        this.cvs = cvs;
    }

    /**
     * Outputs debug information of the entity.
     */
    update(dt) {
        const entities = this.entities();
        for (const entity of entities) {

            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`Entity Count: ${this.em.totalEntities}`, 0, this.cvs.height - 270);
            this.ctx.fillText(`Debug Entity: ${entity}`, 0, this.cvs.height - 290);
            this.ctx.fillStyle = 'lightgray';

            const components = Object.keys(this.em.getComponents(entity));
            for (let i = 0; i < components.length; i++) {
                const componentName = components[i];
                const component = this.em.getComponent(entity, componentName);

                this.ctx.fillText(componentName +": " + JSON.stringify(component), 50, this.cvs.height - 260 + (i + 1) * 15);
                this.ctx.fillStyle = 'lightgray';
            }
            // Output only one entity at a time.
            return;
        }
    }
}