
// Most updated at 8:57
import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";




export default class UI2 extends Phaser.Scene {

    private shieldsLabel!: Phaser.GameObjects.Text;
    private shieldsCollected: number = 0;
    private sc1!: Phaser.GameObjects.Text;
    private sc1Collected: number = 0;
    
    //private timeLabel!: Phaser.GameObjects.Text;
    private lives!: Phaser.GameObjects.Text;
    private livesLeft: number = 5;
    
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
        super('ui2');
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
        }).setInteractive().on('pointerdown', () => {if(!this.scene.isPaused('players2')) this.pauseGame()})

        this.add.text(width - 60, 13, '| |', {
            fontFamily : 'Righteous', fontStyle : 'bolder' , fontSize: '40px', color: '#' + this.colorway['pause']
        }).setInteractive().on('pointerdown', () => {if(!this.scene.isPaused('players2')) this.pauseGame()})

        this.shieldsLabel = this.add.text(1000, 18, 'Shields: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']

        });


        // listen to events coming from the game scene
        events.on('shields-collected', () => {
            this.shieldsCollected++;
            this.shieldsLabel.text = 'Shields: ' + this.shieldsCollected;
            
        })
        events.on('subtract-shield', () => {
            this.shieldsCollected--;
            this.shieldsLabel.text = 'Shields: ' + this.shieldsCollected;
            
        })
        // SCORE LABELS 
        this.sc1 = this.add.text(300, 18, 'SC1: 0', {
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']
        });
        


        
        // Listen to the 'timeUpdated' event
       // SCORE PLAYER 1
        
        events.on('green-50', () => {
            this.sc1Collected+=50;
            this.sc1.text = 'Score: ' + this.sc1Collected;
        });
        events.on('red-100', () => {
            this.sc1Collected+=100;
            this.sc1.text = 'Score: ' + this.sc1Collected;
        });
        events.on('blue-150', () => {
            this.sc1Collected+=150;
            this.sc1.text = 'Score: ' + this.sc1Collected;
        });

        


       // LIVES 
      
        this.lives = this.add.text(10, 18, 'Lives: 5', {
            fontFamily : 'Righteous', fontSize: '32px', color: '#' + this.colorway['UIText']
        });
        /*
        this.l2 = this.add.text(150, 18, 'L2: 0', {
            fontSize: '32px', color: 'yellow'
        });
        */

        
        
        // lives left when collide with enemy 
        // LIVES 1 
        events.on('collide-enemy', () => {
                if(this.livesLeft>0){
                    this.livesLeft --;
                    this.lives.text = 'Lives: ' + this.livesLeft;
                }else{
                    this.scene.start('gameover');
                    events.emit('gameover');
                }    
        });
        //increases life
        events.on('life-up',() => {
            this.livesLeft++;
            this.lives.text = 'Lives: ' + this.livesLeft;
        });
        
       
        
        
    }

    update() {
        const pJustPressed = Phaser.Input.Keyboard.JustDown(this.keys.P);
        const escJustPressed = Phaser.Input.Keyboard.JustDown(this.keys.ESC);
        if(!(this.scene.isPaused('2p_easy') || this.scene.isPaused('game_2p_Hard')) && (this.keys.P.isDown || this.keys.ESC.isDown) && !(pJustPressed || escJustPressed)){
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
            
            this.scene.pause('1p_easy').pause('1p_hard')
            .pause('2p_easy').pause('2p_hard')

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
            this.scene.resume('1p_easy').resume('1p_hard')
            .resume('2p_easy').resume('2p_hard')
        }
    
        returnStart(pauseMenu){
            pauseMenu.destroy(true)
            this.scene.stop('1p_easy').stop('2p_easy')
            .stop('1p_hard').stop('2p_hard').start('start')
        }

    
}