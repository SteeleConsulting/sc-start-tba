
// Most updated at 8:57
import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";



export default class UI2 extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private sc1!: Phaser.GameObjects.Text;
    private sc2!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private livesLeft: number = 0;
    //private timeLabel!: Phaser.GameObjects.Text;
    private l1!: Phaser.GameObjects.Text;
    private l1Left: number = 0;
    private l2!: Phaser.GameObjects.Text;
    private l2Left: number = 0;
    
    graphics;
    

    constructor() {
        super('ui2');
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




        this.powerupsLabel = this.add.text(1000, 18, 'PowerUps: 0', {
            fontSize: '32px', color: 'yellow'

        });


        // listen to events coming from the game scene
        events.on('powerup-collided', () => {
            this.powerupsCollected++;
            this.powerupsLabel.text = 'PowerUps: ' + this.powerupsCollected;
            
        })
        this.sc1 = this.add.text(300, 18, 'SC1: 0', {
            fontSize: '32px', color: 'yellow'
        });
        this.sc2 = this.add.text(600, 18, 'SC2: 0', {
            fontSize: '32px', color: 'yellow'
        });


        
        // Listen to the 'timeUpdated' event
        
        
        events.on('green-50', () => {
            this.scoreCollected+=50;
            this.sc1.text = 'Score: ' + this.scoreCollected;
        });
        events.on('red-100', () => {
            this.scoreCollected+=100;
            this.sc1.text = 'Score: ' + this.scoreCollected;
        });
        events.on('blue-150', () => {
            this.scoreCollected+=150;
            this.sc1.text = 'Score: ' + this.scoreCollected;
        });


       // LIVES 
       /*
        
        this.livesLabel = this.add.text(20, 18, 'Lives: 0', {
            fontSize: '32px', color: 'yellow'
        });
        */
        this.l1 = this.add.text(10, 18, 'L1: 0', {
            fontSize: '32px', color: 'yellow'
        });
        this.l2 = this.add.text(150, 18, 'L2: 0', {
            fontSize: '32px', color: 'yellow'
        });

        
        /*
        // lives left when collide with enemy 
        events.on('collide-enemy', () => {
                if(this.livesLeft>0){
                    this.livesLeft --;
                    this.livesLabel.text = 'Lives: ' + this.livesLeft;
                }else{
                    events.emit('gameover');
                }    
        });
        */
        events.on('two-players', () => {
            this.l1 = this.add.text(20, 18, 'L1: 0', {
                fontSize: '32px', color: 'yellow'
            });
            this.l2 = this.add.text(20, 18, 'L2: 0', {
                fontSize: '32px', color: 'yellow'
            });
            

        })

        
        
    }

    update() {

    }
    

    
}