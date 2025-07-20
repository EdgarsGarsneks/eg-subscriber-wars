import { System } from "../../../ecs/system.js";
import { BOT_WIN_RADIUS } from "../../constants.js";

export class VictoryScreenSystem extends System {
    constructor(entityManager, ctx, cvs) {
        super(entityManager, ['subscriber', 'bot', 'circle']);
        this.ctx = ctx;
        this.cvs = cvs;
        this.showVictoryScreen = false;
        this.gameEnded = false;
        this.topBots = [];
        this.initEvents = true;
    }

    update(dt) {
        if(!this.gameEnded){
            for(const entity of this.entities()){
                const size =  this.em.getComponent(entity,'circle').radius
                if(size >= BOT_WIN_RADIUS) {
                    this.showVictoryScreen = true;
                    this.gameEnded = true;
                    this.topBots = [...this.em.get('subscriber').keys()].map(entity => {
                        const size = this.em.getComponent(entity, 'circle').radius
                        const subscriber = this.em.getComponent(entity, 'subscriber');
                        return {
                            name: subscriber.name,
                            img: subscriber.img,
                            size: size
                        };
                    }).sort((a, b) => b.size - a.size);
                    this.topBots = [this.topBots[0], this.topBots[1], this.topBots[2]];
                    break;
                }
            }
        } else if(this.showVictoryScreen) {
            this.renderVictoryScreen();
        }
        
    }

    triggerVictory(topBots) {
        this.showVictoryScreen = true;
        this.topBots = topBots;
    }

    renderVictoryScreen() {
        const { width, height } = this.cvs;

        // Draw semi-transparent background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, width, height);

        // Draw title
        this.ctx.fillStyle = '#FFD700'; // Gold color
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Victory!', width / 2, height * 0.1);

        // Draw pedestal
        const pedestalWidth = width * 0.2;
        const pedestalHeight = height * 0.1;
        const positions = [
            { x: width / 2, y: height * 0.6, height: pedestalHeight * 2, color:'#FFD700' }, // 1st place
            { x: width / 2 - pedestalWidth, y: height * 0.6 + pedestalHeight * 0.5, height: pedestalHeight * 1.2 , color: 'lightgray'}, // 2nd place
            { x: width / 2 + pedestalWidth, y: height * 0.6 + pedestalHeight * 0.5, height: pedestalHeight , color: '#8B4513'}  // 3rd place
        ];

        this.ctx.fillStyle = '#8B4513'; // Brown color for pedestal
        positions.forEach((pos, index) => {
            this.ctx.fillStyle = pos.color; // White color
            this.ctx.fillRect(pos.x - pedestalWidth / 2, pos.y, pedestalWidth, -pos.height);

            // Draw bot image and stats
            if (this.topBots[index]) {
                const bot = this.topBots[index];
                const img = bot.img

                // Draw bot image
                const imgSize = pedestalWidth * 0.6;
                this.ctx.drawImage(
                    img,
                    pos.x - imgSize / 2,
                    pos.y - pos.height - imgSize,
                    imgSize,
                    imgSize
                );
                // Draw bot name with medal emoji
                const medals = ['🥇', '🥈', '🥉']; // Gold, Silver, Bronze medals
                this.ctx.font = 'bold 24px Arial';
                this.ctx.fillText(`${medals[index]} ${bot.name} ${medals[index]}`, pos.x, pos.y - pos.height - imgSize - 20);
 }
        }); 

        // Draw "Play Again" button
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = width / 2 - buttonWidth / 2;
        const buttonY = height * 0.8;

        this.ctx.fillStyle = '#FFA500'; // Orange color
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = '#FFFFFF'; // White color
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Play Again', width / 2, buttonY + buttonHeight / 2 + 8);

        this.ctx.fillStyle = '#fe0000ff'; // Orange color
        this.ctx.fillRect(buttonX , buttonY - 50, buttonWidth, buttonHeight);

        this.ctx.fillStyle = '#FFFFFF'; // White color
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Continue', width / 2, buttonY + buttonHeight / 2 + 8 - 50);

        if(!this.initEvents) return;
        // Add click listener for the button
        this.cvs.addEventListener('click', (e) => {
            if(!this.showVictoryScreen) return;
            const rect = this.cvs.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (
                mouseX >= buttonX &&
                mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY &&
                mouseY <= buttonY + buttonHeight
            ) {
                this.resetGame();
            }

            if (
                mouseX >= buttonX &&
                mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY - 50 &&
                mouseY <= buttonY - 50 + buttonHeight
            ) {
                this.showVictoryScreen = false;
                console.log("?")
            }   
        });
        
        this.initEvents = false;
    }

    resetGame() {
        location.reload()
    }
}