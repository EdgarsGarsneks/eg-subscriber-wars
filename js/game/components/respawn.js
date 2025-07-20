export class RespawnComponent {

    constructor(respawnTime) {
        this.respawnTime = respawnTime; 
        this.respawnTimer = 0; 
        this.isRespawning = false;
    }

}
