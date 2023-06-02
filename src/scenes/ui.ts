
// Most updated at 8:57
import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";




export default class UI extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private livesLabel!: Phaser.GameObjects.Text;
    private livesLeft: number = 3;

    



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
        const fonts = new WebFontFile(this.load, 'Righteous')
		this.load.addFile(fonts)

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




        this.powerupsLabel = this.add.text(1000, 18, 'PowerUps: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: 'yellow'

        });


        // listen to events coming from the game scene
        events.on('powerup-collided', () => {
            this.powerupsCollected++;
            this.powerupsLabel.text = 'PowerUps: ' + this.powerupsCollected;
            
        })
        this.scoreLabel = this.add.text(300, 18, 'Score: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: 'yellow'
        });
        
        // Listen to the 'timeUpdated' event
        
        
        events.on('green-50', () => {
            this.scoreCollected+=50;
            this.scoreLabel.text = 'Score: ' + this.scoreCollected;
        });
        events.on('red-100', () => {
            this.scoreCollected+=100;
            this.scoreLabel.text = 'Score: ' + this.scoreCollected;
        });
        events.on('blue-150', () => {
            this.scoreCollected+=150;
            this.scoreLabel.text = 'Score: ' + this.scoreCollected;
        });


       // LIVES 
        
        this.livesLabel = this.add.text(20, 18, 'Lives: 3', {
            fontFamily : 'Righteous', fontSize: '32px', color: 'yellow'
        });
        
        
        // lives left when collide with enemy 
        events.on('collide-enemy', () => {
                if(this.livesLeft>0){
                    this.livesLeft --;
                    this.livesLabel.text = 'Lives: ' + this.livesLeft;
                }else{
                    events.emit('gameover');
                }    
        });
       

        
        
    }

    update() {

    }
    

    // creates a rounded rectangle
    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }
}