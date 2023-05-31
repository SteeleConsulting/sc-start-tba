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
        
        // Listen to the 'timeUpdated' event
        
        events.on('timeUpdated', (time) => {
            this.time.addEvent({
                delay: 1000, // every second
                callback: () => {
                  // Check if the time is greater than 0
                  if (this.game.getTime() > 0) {
                    this.scoreCollected+=1;
                    this.scoreLabel.text = 'Score: ' + this.scoreCollected;
                  }
                },
                loop: true // Repeat the timer indefinitely
              });
            
        });
        
        events.on('enemy-explode', () => {
            this.scoreCollected+=100;
            this.scoreLabel.text = 'Score: ' + this.scoreCollected;
        })
    }

    update() {

    }
}