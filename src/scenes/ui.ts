import Phaser, { Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
//import { sharedInstance as events } from "../helpers/eventCenter";


export default class UI extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private timeLabel!: Phaser.GameObjects.Text;
    private lifeCounter!: [Phaser.GameObjects.Sprite];
    graphics;

    constructor() {
        super('ui');
    }

    init() {
    }

    preload(){
        this.load.image('life', 'UI/playerLife1_blue.png');

        this.load.atlas('space', 'assets/space-shooter/space-shooter-tileset.png', 'assets/space-shooter/space-shooter-tileset.json');  
        

    }

    create(){


        
        // add a text label to the screen
        
        this.add.rectangle(800,0,1600, 150,0x81B29A)
        this.add.rectangle(800,1000,1600, 25,0x81B29A)
        this.add.rectangle(0,500,25, 1000,0x81B29A)
        this.add.rectangle(1600,500,25, 1000,0x81B29A)

        this.add.rectangle(800,0,1600, 142,0x3D405B)
        this.add.rectangle(800,1000,1600, 20,0x3D405B)
        this.add.rectangle(0,500,20, 1000,0x3D405B)
        this.add.rectangle(1600,500,20, 1000,0x3D405B)


        this.lifeUpdate(3)
        this.lifeUpdate(2)
        this.lifeUpdate(0)


        this.powerupsLabel = this.add.text(1000, 18, 'PowerUps: 0', {
            fontSize: '32px', color: 'yellow'

        });


        // listen to events coming from the game scene
        events.on('powerup-collided', () => {
            this.powerupsCollected++;
            this.powerupsLabel.text = 'PowerUps: ' + this.powerupsCollected;
            
        })
        this.scoreLabel = this.add.text(300, 18, 'Score: 0', {
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

    lifeUpdate(lives : number) {
        let life = [this.matter.add.image(50, 35, 'space','UI/playerLife1_blue.png')]
        if(lives == 0) life[0].destroy
        for(let i = 1; i < 3; i++){
            if(i >= lives){ life[i].destroy() }
            else {life[i] = this.matter.add.image(50 * (i + 1), 35, 'space','UI/playerLife1_blue.png')}
        }
        
    }
    // lifeClear(lives : number){
    //     Phaser.GameObjects.Sprite.
    // }
}