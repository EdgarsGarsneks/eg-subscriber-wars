export class EntityManager {

    constructor() {
        this.nextEntityId = 0;
        this.components = new Map();
        this.totalEntities = 0;
    }

    /**
     * Create a new unique entity reference
     */
    createEntity() {
        this.totalEntities++;
        return this.nextEntityId++;
    }

    /**
     * Adds component to provided entity
     */
    addComponent(e, name, data = {}) {
        if (!this.components.has(name)) {
            this.components.set(name, new Map());
        }

        this.components.get(name).set(e, data);
    }


    /**
     * Returns entities component
     */
    getComponent(e, name) {
        if (this.components.has(name)) {
            return this.components.get(name).get(e);
        }
        return null;
    }

    /**
     * Checks if given entity has component registered.
     */
    hasComponent(e, name) {
        return this.components.has(name) && this.components.get(name).has(e);
    }

    /**
     * Removes component from given entity.
     */
    removeComponent(e, name) {
        if (this.components.has(name)) {
            this.components.get(name).delete(e);
        }
    }

    /**
     * Returns map of all entities with component.
     */
    get(name) {
        return this.components.get(name) || new Map();
    }

    /**
     * Removes entity from the system.
     */
    removeEntity(e) {
        this.totalEntities--;
        for (let comp of this.components.values()) {
            comp.delete(e);
        }
    }

    /**
     * Get all components for particular entity.
     */
    getComponents(e) {
        const result = {};
        for (let [name, comp] of this.components.entries()) {
            if (comp.has(e)) {
                result[name] = comp.get(e);
            }
        }
        return result;
    }

}