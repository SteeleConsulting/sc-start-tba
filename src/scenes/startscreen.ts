import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class StartScreen extends Phaser.Scene {
    constructor() {
        super('start');
    }
    
    graphics;
    startButtonBack;
    startButtonFront;
    startButtonText;
    background;
    titleText;
    gameClick = false
    creditClick = false
    backClick = false
    credBox;

    init() { }

    preload(){
        
        const { width, height } = this.scale;
        this.background = this.add.graphics()
        this.background.fillStyle(0x14213D, 1)
        this.background.fillRoundedRect(0,0,width,height,0)

        this.titleText = this.add.text(width / 2 - 270, height / 2 - 200, 'GAME TITLE', {
            fontSize: '90px', color : '#E5E5E5'
        })
        

        this.startButtonBack = this.add.graphics();
        this.startButtonBack.fillStyle(0xE5E5E5, 1);
        this.startButtonBack.fillRoundedRect(width / 2 - 300, height / 2 - 8, 600, 150, 15);

        this.startButtonFront = this.add.graphics();
        this.startButtonFront.fillStyle(0xFCA311, 1);
        this.startButtonFront.fillRoundedRect(width / 2 - 290, height / 2, 600, 150, 15);

        this.startButtonText = this.add.text(width / 2 - 220, height / 2 + 40, 'START GAME', {
            fontSize: '75px', color : '#000000'
        });
        
        this.startButtonBack.setInteractive().on('pointerdown', () => (this.gameClick = true))
        this.startButtonFront.setInteractive().on('pointerdown', () => (this.gameClick = true));
        this.startButtonText.setInteractive().on('pointerdown', () => (this.gameClick = true ))

        this.add.text(30, height - 60, 'INSERT STEELE\n  LOGO HERE')
        this.add.text(width - 165, height - 65, 'CREDITS', {fontSize: '30px', color : '#E5E5E5'})
        .setInteractive().on('pointerdown', () => (this.creditClick = true))
    }

    create(){ }

    update() {
        if(this.gameClick == true){
            console.log('start button clicked')
            this.scene.start('players')
            this.gameClick = false
        }
        if(this.creditClick == true){
            console.log('open credits')
            this.openCredits()
            this.creditClick = false
        }
        if(this.backClick == true){
            console.log('close credits')
            this.hideCredBox()
            this.backClick = false
        }
    }


    openCredits() {
    
        let {width, height} = this.scale
        if (this.credBox) {
            this.credBox.destroy();
        }
        
        var credBox = this.add.group();
        var rect = new Phaser.Geom.Rectangle(width / 4, height / 4, width / 2, height / 2)
        var credBack = this.add.graphics({ fillStyle: { color: 0xFCA311 } });
        var credBack2 = this.add.graphics({fillStyle: {color : 0xE5E5E5 } })
        credBack.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 30);
        credBack2.fillRoundedRect(rect.x + 5, rect.y + 5, rect.width, rect.height, 30);
        
        
        let creditText = this.add.text(width / 4 + 30, height / 4 + 30, 'Thank you for playing!' 
            + '\n\nCreated By:'
            + '\n\t \tBianka Boudreaux' 
            + '\n\t \tGabriela Sigala Acosta' 
            + '\n\t \tIsmael Parra'
            + '\n\t \tAlexander Cabos', {fontSize : '40px', color : '#000000'})


        
        var backButton = new Phaser.Geom.Rectangle(width / 2 - 145, height / 2 + 120, width / 6, height / 12)

        var credButton1 = this.add.graphics({ fillStyle: { color: 0xFCA311 } });
            credButton1.fillRoundedRect(width / 2 - 145, height / 2 + 120, width / 6, height / 12, 15)
        var credButton2 = this.add.graphics({ fillStyle: { color: 0x14213D } });
            credButton2.fillRoundedRect(width / 2 - 140, height / 2 + 125, width / 6, height / 12, 15)
        
        var credButtonText = this.add.text(width / 2 - 115, height / 2 + 150, 'Back to Menu', {fontSize : '30px', color : '#E5E5E5'})
        
        credBox.add(credBack);
        credBox.add(credBack2);
        credBox.add(creditText);
        credBox.add(credButton1);
        credBox.add(credButton2);
        credBox.add(credButtonText);
        
        
        credButton1.setInteractive().on('pointerdown', () => this.backClick = true)
        credButton2.setInteractive().on('pointerdown', () => this.backClick = true)
        credButtonText.setInteractive().on('pointerdown', () => this.backClick = true)
        this.credBox = credBox;
    }
     
    hideCredBox() {
     
        console.log('hide');
        this.credBox.destroy(true)
     
    }
}


