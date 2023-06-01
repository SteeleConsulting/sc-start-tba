import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
//import { sharedInstance as events } from "../helpers/eventCenter";


export default class UI extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private timeLabel!: Phaser.GameObjects.Text;
    private lifeCounter!: [Phaser.GameObjects.Sprite];


    colorway = {
        'border1' : 0x1D3557,
        'border2' : 0x457B9D 
    }

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

        const { width, height } = this.scale;

        
        // create UI border
        this.makeButton(0, 0, width, 75, this.colorway['border1'], 0)
        this.makeButton(0, 0, 30, height, this.colorway['border1'], 0)
        this.makeButton(width, 0, -30, height,this.colorway['border1'],0)
        this.makeButton(0, height,width, -30,this.colorway['border1'], 0)


        this.makeButton(0, 0, width, 65, this.colorway['border2'], 0)
        this.makeButton(0, 0, 20, height, this.colorway['border2'], 0)
        this.makeButton(width, 0, -20, height,this.colorway['border2'],0)
        this.makeButton(0, height,width, -20,this.colorway['border2'], 0)


        this.lifeUpdate(3)


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
        var life1, life2, life3
        if(lives >= 3) {
            life3 = this.matter.add.image(130, 30, 'space', 'UI/playerLife1_blue.png')
        } else{
            life3.destroy()
        }
        if(lives >= 2) {
            life2 = this.matter.add.image(80, 30, 'space', 'UI/playerLife1_blue.png')
        } else{
            life2.destroy()
        }
        if(lives >= 1) {
            life1 = this.matter.add.image(30, 30, 'space', 'UI/playerLife1_blue.png')
        } else{
            life1.destroy()
        }
        
        
    }

    // lifeClear(){
    //     this.lifeBox.destroy(true)
    // }

    
    // creates a rounded rectangle
    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }
}