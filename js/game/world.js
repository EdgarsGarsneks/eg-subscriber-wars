import { EntityManager } from "../ecs/entity-manager.js";
import { BotComponent } from "./components/bot.js";
import { ImageComponent } from "./components/image.js";
import { RadarSystem } from "./systems/ai/radar-system.js";
import { BasicBotController } from "./systems/ai/basic-controller.js"
import { CameraFollowSystem } from "./systems/render/camera-follow-system.js";
import { CollisionSystem } from "./systems/gameplay/collision-system.js";
import { HealthBarRenderSystem } from "./systems/render/healthbar-render.js";
import { MovementSystem } from "./systems/gameplay/movement-system.js";
import { RenderSystem } from "./systems/render/render-system.js";
import { WeaponSystem } from "./systems/gameplay/weapon-system.js";
import { RemoveEntitySystem } from "./systems/gameplay/remove-entity-system.js";
import { RemoveEntityAfterSystem } from "./systems/gameplay/remove-after-system.js";
import { MoveToTargetSystem } from "./systems/gameplay/move-to-target-system.js";
import { BulletCollisionSystem } from "./systems/gameplay/bullet-collision.js";
import { DamageSystem } from "./systems/gameplay/damage-system.js";
import { OnBotDeath } from "./systems/gameplay/bot-dead.js";
import { BotRespawnSystem } from "./systems/gameplay/bot-respawn-system.js";
import { DebugEntitySystem } from "./systems/debug/debug-entity.js";
import { PowerUpSpawnSystem } from "./systems/gameplay/power-up-spawn-system.js";
import { PowerUpPickupSystem } from "./systems/gameplay/power-up-pickup.js";
import { LimitsSystem } from "./systems/gameplay/limits-system.js";
import { Weapon } from "./components/weapon.js";
import { Shotgun } from "./components/shotgun.js";
import { ShieldRenderSystem } from "./systems/render/shield-render-system.js";
import { BotUnstuckSystem } from "./systems/gameplay/bot-unstuck-system.js";
import { GrowSystem } from "./systems/gameplay/grow-system.js";
import { HealthRegenSystem } from "./systems/gameplay/health-regen-system.js";
import { subscribers } from "./subscribers.js";
import { SubscriberComponent } from "./components/subscriber.js";
import { TableStatsRenderSystem } from "./systems/render/table-stats.js";
import { EdgarsGarsneksAI } from "./bot-ai/edgars-garsneks.js";
import { VictoryScreenSystem } from "./systems/render/victory-screen.js";
import { Camera } from "./camera.js";
import { BOT_BASE_HP, BOT_BASE_RADIUS, BOT_COUNT, WORLD_HEIGHT, WORLD_WIDTH } from "./constants.js";

const hsv = (h, s, v) => `hsl(${h}deg ${s}% ${v}%)`;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export class World {

    constructor() {
        this.entityManager = new EntityManager();
        this.systems = [];
    }

    init(ctx, cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.camera = new Camera(0, 0, cvs.width, cvs.height, 5.0);

        this.resize();
        this.setupEventListeners();
        this.initBots();
        this.registerSystems();
    }

    registerSystems() {
        this.addSystem(new CameraFollowSystem(this.entityManager, this.camera));
        this.addSystem(new RadarSystem(this.entityManager));
        this.addSystem(new MoveToTargetSystem(this.entityManager));
        this.addSystem(new BasicBotController(this.entityManager));
        this.addSystem(new EdgarsGarsneksAI(this.entityManager));
        this.addSystem(new MovementSystem(this.entityManager));

        this.addSystem(new BotUnstuckSystem(this.entityManager));
        this.addSystem(new LimitsSystem(this.entityManager));
        this.addSystem(new CollisionSystem(this.entityManager));
        this.addSystem(new WeaponSystem(this.entityManager));
        this.addSystem(new PowerUpPickupSystem(this.entityManager));

        this.addSystem(new BulletCollisionSystem(this.entityManager));

        this.addSystem(new RenderSystem(this.entityManager, this.ctx, this.cvs, this.camera));
        this.addSystem(new HealthBarRenderSystem(this.entityManager, this.ctx, this.cvs, this.camera));
        this.addSystem(new DebugEntitySystem(this.entityManager, this.ctx, this.cvs));
        this.addSystem(new ShieldRenderSystem(this.entityManager, this.ctx, this.cvs, this.camera));

        this.addSystem(new HealthRegenSystem(this.entityManager));
        this.addSystem(new DamageSystem(this.entityManager));
        this.addSystem(new GrowSystem(this.entityManager));
        this.addSystem(new OnBotDeath(this.entityManager));
        this.addSystem(new BotRespawnSystem(this.entityManager));
        this.addSystem(new PowerUpSpawnSystem(this.entityManager));

        this.addSystem(new RemoveEntityAfterSystem(this.entityManager));
        this.addSystem(new RemoveEntitySystem(this.entityManager));
        this.addSystem(new TableStatsRenderSystem(this.entityManager));
        this.addSystem(new VictoryScreenSystem(this.entityManager, this.ctx, this.cvs));

    }

    initBots() {
        const subscriberCount = BOT_COUNT;

        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            const bot = this.createSubscriberBot(subscriber);

            if (i === 0) {
                this.entityManager.addComponent(bot, 'camera-follow');
            }
        }


        for (let i = subscribers.length + 1; i < subscriberCount; i++) {
            this.createBot();
        }
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(dt) {
        for (const system of this.systems) {
            system.update(dt);
        }
    }

    resize() {
        this.cvs.width = window.innerWidth;
        this.cvs.height = window.innerHeight;
        this.camera.width = this.cvs.width;
        this.camera.height = this.cvs.height;
    }

    followEntity(entity) {
        this.entityManager.get('camera-follow').clear();
        this.entityManager.addComponent(entity, 'camera-follow');
    }

    createBot() {
        const bot = this.entityManager.createEntity();

        this.entityManager.addComponent(bot, 'position', { x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT });
        this.entityManager.addComponent(bot, 'velocity', { vx: 0, vy: 0 });
        this.entityManager.addComponent(bot, 'circle', { radius: BOT_BASE_RADIUS });
        this.entityManager.addComponent(bot, 'color', hsv(Math.random() * 360, 85, 60));
        this.entityManager.addComponent(bot, 'collider', { enabled: true, collidesWith: [] });
        this.entityManager.addComponent(bot, 'health', { hp: BOT_BASE_HP, maxHp: BOT_BASE_HP });
        this.entityManager.addComponent(bot, 'regen', { timeSinceLastDamage: 0 });
        this.entityManager.addComponent(bot, 'radar', { closestTarget: {}, largestTarget: {}, closestPowerUp: {}, closestBullet: {} });

        this.entityManager.addComponent(bot, 'bot', new BotComponent());
        this.entityManager.addComponent(bot, 'weapon', new Weapon(5, 300, 1, 200, 2500));

        this.entityManager.addComponent(bot, 'enabled');
        this.entityManager.addComponent(bot, 'basic-controller');

        return bot;
    }

    createSubscriberBot(subscriber) {
        const bot = this.createBot()

        this.entityManager.addComponent(bot, 'subscriber', new SubscriberComponent(subscriber.name, subscriber.img));
        this.entityManager.addComponent(bot, 'weapon', new Shotgun(9, 300, 1, 250, 2000));
        this.entityManager.addComponent(bot, 'image', new ImageComponent(subscriber.img));

        if (subscriber.controller) {
            this.entityManager.removeComponent(bot, 'basic-controller');
            this.entityManager.addComponent(bot, subscriber.controller);
        }

        this.entityManager.getComponent(bot, 'circle').radius = BOT_BASE_RADIUS + 10;
        this.entityManager.getComponent(bot, 'health').hp = BOT_BASE_HP + 10;
        this.entityManager.getComponent(bot, 'health').maxHp = BOT_BASE_HP + 10;

        return bot;
    }


    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousedown', e => {
            this.cvs.style.cursor = 'grabbing';
            this.camera.dragging = true;

            this.entityManager.get('camera-follow').keys().forEach(entity => {
                this.entityManager.removeComponent(entity, 'camera-follow');
            });
        });

        window.addEventListener('mousemove', e => {
            if (this.camera.dragging) {
                const dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
                const dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
                this.camera.x = this.camera.x - dx;
                this.camera.y = this.camera.y - dy;
            }
        });

        window.addEventListener('mouseup', () => {
            this.cvs.style.cursor = 'grab';
            this.camera.dragging = false;
        });

        window.addEventListener('wheel', e => {
            const zoom = e.deltaY > 0 ? 1.1 : 0.9;
            this.camera.zoom = clamp((this.camera.zoom || 1) * zoom, 0.5, 5);
        });
    }

}