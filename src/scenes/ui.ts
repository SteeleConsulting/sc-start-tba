
// Most updated at 8:57
import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";
import GameOver from "./gameover";




export default class UI extends Phaser.Scene {

    private powerupsLabel!: Phaser.GameObjects.Text;
    private powerupsCollected: number = 0;
    private scoreLabel!: Phaser.GameObjects.Text;
    private scoreCollected: number = 0;
    private livesLabel!: Phaser.GameObjects.Text;
    private livesLeft: number = 3;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys
    



    colorway = {
        'border1' : 0x1D3557,
        'border2' : 0x457B9D,
        'resume1' : 0xE63946,
        'resume2' : 0x457B9D,
        'restart1' : 0xE63946,
        'restart2' : 0x457B9D,
        'start1' : 0xE63946,
        'start2' : 0x457B9D,
        'UIText' : 'F1FAEE',
        'pause' : 'E63946',
        'pauseText' : 'E63946',
        'pauseButtonText' : 'F1FAEE',
    }

    constructor() {
        super('ui');
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload(){
        const fonts = new WebFontFile(this.load, 'Righteous')
		this.load.addFile(fonts)

        this.load.image('life', 'UI/playerLife1_blue.png');
        this.load.atlas('space', 'assets/space-shooter/space-shooter-tileset.png', 'assets/space-shooter/space-shooter-tileset.json');  
    }

    create(){
        this.keys = this.input.keyboard.addKeys('P,ESC')
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

        /*------------All objects under here, above is border-----------*/

        this.add.text(width - 55, 13, '| |', {
            fontFamily : 'Righteous', fontStyle : 'bolder' , fontSize: '40px', color: '#' + this.colorway['pause']
        }).setInteractive().on('pointerdown', () => {if(!this.scene.isPaused('game')) this.pauseGame()})

        this.add.text(width - 60, 13, '| |', {
            fontFamily : 'Righteous', fontStyle : 'bolder' , fontSize: '40px', color: '#' + this.colorway['pause']
        }).setInteractive().on('pointerdown', () => {if(!this.scene.isPaused('game')) this.pauseGame()})

        this.powerupsLabel = this.add.text(1000, 18, 'PowerUps: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']

        });


        // listen to events coming from the game scene
        events.on('powerup-collided', () => {
            this.powerupsCollected++;
            this.powerupsLabel.text = 'PowerUps: ' + this.powerupsCollected;
            
        })
        this.scoreLabel = this.add.text(300, 18, 'Score: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']
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
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']
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
        //increases life
        events.on('life-up',() => {
            this.livesLeft++;
            this.livesLabel.text = 'Lives: ' + this.livesLeft;
        });
       

        
        
    }

    update() {
        const pJustPressed = Phaser.Input.Keyboard.JustDown(this.keys.P);
        const escJustPressed = Phaser.Input.Keyboard.JustDown(this.keys.ESC);
        if(!(this.scene.isPaused('game_2p_easy') || this.scene.isPaused('game_2p_Hard')) && (this.keys.P.isDown || this.keys.ESC.isDown) && !(pJustPressed || escJustPressed)){
            this.pauseGame()
        } 

    }
    

    // creates a rounded rectangle
    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }

    pauseGame(){
        const {width, height} = this.scale
        var pauseMenu = this.add.group()
        this.scene.pause('game')
        pauseMenu.add(this.makeButton(width * 3 / 8 - 20, height * 3 / 7 + 45, 500, 120, this.colorway['restart2'], 15))
        pauseMenu.add(this.makeButton(width * 3 / 8 - 10, height * 3 / 7 + 50, 500, 120, this.colorway['restart1'], 15))

        pauseMenu.add(this.makeButton(width * 3 / 8 - 20, height * 5 / 7 - 40, 500, 120, this.colorway['start2'], 15))
        pauseMenu.add(this.makeButton(width * 3 / 8 - 10, height * 5 / 7 - 35, 500, 120, this.colorway['start1'], 15))


        pauseMenu.add(this.add.text(width * 2 / 9 - 5, height / 6, 'GAME PAUSED', {
            fontFamily : 'Righteous', fontStyle : 'bold', fontSize: '140px', color : '#' + this.colorway['pauseText']
        }))

        pauseMenu.add(this.add.text(width * 2 / 5 + 5, height * 3 / 7 + 75 , 'RESUME GAME', {
            fontFamily : 'Righteous', fontSize: '55px', color : '#' + this.colorway['pauseButtonText']
        }).setInteractive().on('pointerdown', () => {this.hidePauseMenu(pauseMenu)}))
        
        pauseMenu.add(this.add.text(width * 2 / 5 - 35, height * 5 / 7 - 10, 'RETURN TO MENU', {
            fontFamily : 'Righteous', fontSize: '55px', color : '#' + this.colorway['pauseButtonText']
        }).setInteractive().on('pointerdown', () => {this.returnStart(pauseMenu)}))
    }

    hidePauseMenu(pauseMenu) {
        console.log('hide');
        pauseMenu.destroy(true)
        if(this.scene.isActive('game_1p_easy')){
            this.scene.resume('game_1p_easy')
        } else if(this.scene.isActive('game_1p_hard')){
            this.scene.resume('game_1p_hard')
        } else if(this.scene.isActive('game_2p_easy')){
            this.scene.resume('game_2p_easy')
        } else if(this.scene.isActive('game_2p_hard')){
            this.scene.resume('game_2p_hard')
        }
    }

    returnStart(pauseMenu){
        pauseMenu.destroy()
        if(this.scene.isActive('game_1p_easy')){
            this.scene.resume('game_1p_easy')
        } else if(this.scene.isActive('game_1p_hard')){
            this.scene.resume('game_1p_hard')
        } else if(this.scene.isActive('game_2p_easy')){
            this.scene.resume('game_2p_easy')
        } else if(this.scene.isActive('game_2p_hard')){
            this.scene.resume('game_2p_hard')
        }
        this.scene.start('start')
    }
}