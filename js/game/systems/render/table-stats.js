import { System } from "../../../ecs/system.js";

export class TableStatsRenderSystem extends System {

    constructor(entityManager) {
        super(entityManager, ['bot', 'subscriber']);
        this.lastUpdate = 2000;
    }

    update(dt) {
        this.lastUpdate += dt;
        if (this.lastUpdate < 1000) return; 
        const entites = [...this.entities()].sort((a, b) => this.em.getComponent(b, 'circle').radius - this.em.getComponent(a, 'circle').radius);

        var table = document.getElementById('leaderboard-body')

        table.innerHTML = ''; 
        for (var i = 0; i < entites.length; i++) {
            const bot = this.em.getComponent(entites[i], 'bot');
            const circle = this.em.getComponent(entites[i], 'circle');
            const subscriber = this.em.getComponent(entites[i], 'subscriber');
            const color = this.em.getComponent(entites[i], 'color')
            table.innerHTML += `<tr class="stats-row ${this.em.hasComponent(entites[i], 'camera-follow') ? 'follow' : ''}" onclick="window.world.followEntity(${entites[i]})"><td style="color:${color}">${subscriber.name}</td><td>${bot.statistics.kills}</td><td>${bot.statistics.deaths}</td><td>${circle.radius.toFixed(0)}</td></tr>`;
        }
        this.lastUpdate = 0;


    }

}