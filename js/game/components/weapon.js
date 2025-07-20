import { BULLET_BASE_RADIUS, BULLET_BASE_SPEED, BULLET_LIFETIME } from "../constants.js";
import { TimerComponent } from "./timer.js";

export class Weapon {

    constructor(ammo, range, damage, fireRate, reloadTime) {
        this.ammo = ammo;
        this.maxAmmo = ammo;
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.reloadTime = reloadTime;

        this.reloading = false;

        this.lastFiredTimer = 0;
        this.reloadTimer = 0;
    }

    shoot(em, position, angle, color, owner) {
        if (this.ammo <= 0) {
            this.reload();
            return;
        }

        if (!this.canShoot()) {
            return; 
        }

        this.lastFiredTimer = this.fireRate;
        this.ammo--;

        const bullet = em.createEntity();

        em.addComponent(bullet, 'position', { x: position.x, y: position.y });
        em.addComponent(bullet, 'circle', { radius: BULLET_BASE_RADIUS });
        em.addComponent(bullet, 'color', color);
        em.addComponent(bullet, 'collider', {enabled: true, collidesWith: []});
        em.addComponent(bullet, 'velocity', {vx: Math.cos(angle) * BULLET_BASE_SPEED, vy: Math.sin(angle) * BULLET_BASE_SPEED});
        em.addComponent(bullet, 'bullet', {owner: owner});
        em.addComponent(bullet, 'remove-after', new TimerComponent(BULLET_LIFETIME));
        em.addComponent(bullet, 'enabled');
    }

    update(dt) {
        if (this.lastFiredTimer > 0) {
            this.lastFiredTimer -= dt;
        }

        if (this.reloading) {
            this.reloadTimer -= dt;
            if (this.reloadTimer <= 0) {
                this.reloading = false;
                this.ammo = this.maxAmmo;
            }
        }
    }

    inRange(distance) {
        return distance <= this.range;
    }

    canShoot() {
        return this.ammo > 0 && !this.reloading && this.lastFiredTimer <= 0;
    }

    reload() {
        if (this.reloading) return;
        this.reloading = true;
        this.reloadTimer = this.reloadTime;
    }


}
