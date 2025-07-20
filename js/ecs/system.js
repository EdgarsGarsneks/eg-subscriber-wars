export class System {

    /**
     * Every system has access to the entityManager 
     * and must provide list of entity components that are required to process.
     */
    constructor(em, requiredComponents = []) {
        this.em = em;
        this.requiredComponents = requiredComponents;
    }

    /**
     * Returns all entities having all of the required components
     */
    *entities() {
        const first = this.em.get(this.requiredComponents[0]);
        for (let [e] of first) { 
            if (this.requiredComponents.every(component => this.em.get(component).has(e))) {
                yield e;
            }
        }
    }

    /**
     * System's logic to be put here.
     */
    update(dt) {
        throw new Error("Override `update` method in subclasses");
    }
}