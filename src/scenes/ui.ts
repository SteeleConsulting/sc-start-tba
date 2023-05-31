import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
//import { sharedInstance as events } from "../helpers/eventCenter";


export default class UI extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private timeLabel!: Phaser.GameObjects.Text;

    constructor() {
        super('ui');
    }

    init() {
    }

    preload(){

    }

    create(){
        // add a text label to the screen
        const { width, height } = this.scale
        this.add.rectangle(800,0,1600, 150,0x81B29A)
        this.add.rectangle(800,0,1600, 142,0x3D405B)

        this.powerupsLabel = this.add.text(1000, 18, 'PowerUps: 0', {
            fontSize: '32px', color: 'yellow'
        });
        

        // listen to events coming from the game scene
        events.on('powerup-collided', () => {
            this.powerupsCollected++;
            this.powerupsLabel.text = 'PowerUps: '+this.powerupsCollected;
        })
        this.scoreLabel = this.add.text(20, 18, 'Score: 0', {
            fontSize: '32px', color: 'yellow'
        });
        events.on('scoreCollected', () => {
            this.scoreCollected++;
            this.scoreLabel.text = 'Score: '+this.scoreCollected;
        })
        
        // Listen to the 'timeUpdated' event
        events.on('timeUpdated', (time) => {
            if (this.game.getTime() > 0) {
                //this.game.getTime/
                this.scoreCollected+=10;
                this.scoreLabel.text = 'Score: ' + this.scoreCollected;
            }
            //this.timeLabel.text = 'Time: ' + time;
        });
    }

    update() {

    }
}