import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class StartScreen extends Phaser.Scene {
    private backgroundMusic!: Phaser.Sound.BaseSound;
    
    constructor() {
        super('start');
    }
    
    //graphics;
    bg;
    startButton
    startText
    credBox;

    init() { }

    preload(){
        this.load.audio('neon', ['assets/sounds/neon-sky.mp3']);

        const fonts = new WebFontFile(this.load, 'Quicksand')
		this.load.addFile(fonts)

        const { width, height } = this.scale;

        var bgRect = new Phaser.Geom.Rectangle(0, 0, width, height)
        var bg = this.add.graphics({fillStyle: {color : 0x14213D } })
        bg.fillRoundedRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height, 0);
    }

    create() {
        this.backgroundMusic = this.sound.add('neon');
        this.backgroundMusic.play();
        const { width, height } = this.scale;

        var startRect = new Phaser.Geom.Rectangle(width / 2 - 255, height / 2 + 5, 500, 120)
        
        var startButtonBack = this.add.graphics({fillStyle : {color : 0xE5E5E5}})
        startButtonBack.fillRoundedRect(startRect.x - 10, startRect.y - 5, startRect.width, startRect.height, 15)

        this.startButton = this.add.graphics({fillStyle : {color : 0xFCA311}})
        this.startButton.fillRoundedRect(startRect.x, startRect.y, startRect.width, startRect.height, 15)
        .setInteractive().on('pointerdown', () => (this.selectPlayers(), console.log('boxclicked')));

        var titleText = this.add.text(width / 2 - 285, height / 2 - 200, 'GAME TITLE', {
            fontFamily : 'Quicksand', fontSize: '100px', color : '#E5E5E5'
        })


        this.startText = this.add.text(width / 2 - 225, height / 2 + 32, 'START GAME', {
            fontFamily: 'Quicksand', fontSize: '70px', color : '#000000'
        }).setInteractive().on('pointerdown', () => (this.selectPlayers(), console.log('textclicked')));

        this.add.text(30, height - 60, 'INSERT STEELE\n  LOGO HERE', {
            fontFamily: 'Quicksand', color : '#E5E5E5'
        })
        this.add.text(width - 165, height - 65, 'CREDITS', {
            fontFamily : 'Quicksand', fontSize: '30px', color : '#E5E5E5'
        }).setInteractive().on('pointerdown', () => (this.openCredits()))
    }

    update() { }

    selectPlayers(){
        this.scene.start('players')
    }


    openCredits() {
        let {width, height} = this.scale
        if (this.credBox) {
            this.credBox.destroy();
        }
        
        var credBox = this.add.group();
        var rect = new Phaser.Geom.Rectangle(width / 4, height / 4, width / 2, height / 2)
        var credBack = this.add.graphics({ fillStyle: { color : 0xFCA311 } });
        var credBack2 = this.add.graphics({fillStyle: { color : 0xE5E5E5 } })
        credBack.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 30);
        credBack2.fillRoundedRect(rect.x + 5, rect.y + 5, rect.width, rect.height, 30);
        
        
        let creditText = this.add.text(width / 4 + 30, height / 4 + 30, 'Thank you for playing!' 
            + '\n\nCreated By:'
            + '\n\t \tBianka Boudreaux' 
            + '\n\t \tGabriela Sigala Acosta' 
            + '\n\t \tIsmael Parra'
            + '\n\t \tAlexander Cabos', {fontFamily : 'Quicksand', fontSize : '40px', color : '#000000'})


        
        var backButton = new Phaser.Geom.Rectangle(width / 2 - 145, height / 2 + 120, width / 6, height / 12)

        var credButton1 = this.add.graphics({ fillStyle: { color: 0xFCA311 } });
            credButton1.fillRoundedRect(width / 2 - 145, height / 2 + 120, width / 6, height / 12, 15)
        var credButton2 = this.add.graphics({ fillStyle: { color: 0x14213D } });
            credButton2.fillRoundedRect(width / 2 - 140, height / 2 + 125, width / 6, height / 12, 15)
        
        var credButtonText = this.add.text(width / 2 - 115, height / 2 + 150, 'Back to Menu', {
            fontFamily : 'Quicksand', fontSize : '30px', color : '#E5E5E5'
        })
        
        credBox.add(credBack);
        credBox.add(credBack2);
        credBox.add(creditText);
        credBox.add(credButton1);
        credBox.add(credButton2);
        credBox.add(credButtonText);
        
        
        credButton1.setInteractive().on('pointerdown', () => this.hideCredBox())
        credButton2.setInteractive().on('pointerdown', () => this.hideCredBox())
        credButtonText.setInteractive().on('pointerdown', () => this.hideCredBox())
        this.credBox = credBox;
    }
     
    hideCredBox() {
        console.log('hide');
        this.credBox.destroy(true)
    }
}


