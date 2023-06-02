import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class StartScreen extends Phaser.Scene {
    private backgroundMusic!: Phaser.Sound.BaseSound;
    
    constructor() {
        super('start');
    }
    
    colorway = {
        'bg' : 0x1D3557,
        'startBack' : 0xE63946,
        'startButton' : 0x457B9D,
        'credBack' : 0xF1FAEE,
        'credBack2' : 0xA8DADC,
        'backButton' : 0x457B9D,
        'backButton2' : 0xE63946,
        'credButton1' : 0x457B9D,
        'credButton2' : 0xE63946,
        'startText' : 'F1FAEE',
        'titleText' : 'F1FAEE',
        'credLinkText' : 'F1FAEE',
        'credText' : '1D3557',
        'logoText' : 'E9C46A',
        'backText' : 'F1FAEE'
    }

    // credBox = this.add.group();

    init() { }

    preload(){
        this.load.audio('neon', ['assets/sounds/neon-sky.mp3']);

        const fonts = new WebFontFile(this.load, 'Righteous')
		this.load.addFile(fonts)

        this.load.image('logo', './assets/TBALogo.png');

        const { width, height } = this.scale;

        // background
        this.makeButton(0, 0, width, height, this.colorway['bg'], 0)
    }

    

    create() {
        this.backgroundMusic = this.sound.add('neon');
        this.backgroundMusic.play();
        const { width, height } = this.scale;

        // back of start button
        this.makeButton(width / 2 - 265, height / 2, 500, 120, this.colorway['startButton'], 15)

        // start button
        this.makeButton(width / 2 - 255, height / 2 + 5, 500, 120, this.colorway['startBack'], 15)
        .setInteractive().on('pointerdown', () => (this.selectPlayers(), console.log('boxclicked')));

        // title text
        this.add.text(width / 4, height / 2 - 200, 'GAME TITLE', {
            fontFamily : 'Righteous', fontStyle : 'bold', fontSize: '135px', color : '#' + this.colorway['titleText']
        })

        // this.add.text(width / 2 - 145, height / 2 - 75, 'A Game by TBA', {
        //     fontFamily : 'Righteous', fontSize : '35px', color : '#' + this.colorway['titleText']
        // })

        // start text
        this.add.text(width / 2 - 225, height / 2 + 32, 'START GAME', {
            fontFamily: 'Righteous', fontSize: '70px', color : '#' + this.colorway['startText']
        }).setInteractive().on('pointerdown', () => (this.selectPlayers(), console.log('textclicked')));

        // logo text
        // this.add.text(30, height - 60, 'INSERT STEELE\n  LOGO HERE', {
        //     fontFamily: 'Righteous', color : '#' + this.colorway['logoText']
        // })
        this.add.sprite(70, height - 60, 'logo')

        // credit link
        this.makeButton(width - 210, height - 85, width / 9, height / 15, this.colorway['credButton1'], 15)
        this.makeButton(width - 200, height - 80, width / 9, height / 15, this.colorway['credButton2'], 15)

        this.add.text(width - 170, height - 65, 'CREDITS', {
            fontFamily : 'Righteous', fontSize: '30px', color : '#' + this.colorway['credLinkText']
        }).setInteractive().on('pointerdown', () => (this.openCredits()))
    }

    update() { }


    // creates a rounded rectangle
    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }

    // changes to players screen
    selectPlayers(){
        this.scene.start('players')
    }

    // create credit text box
    openCredits() {
        let {width, height} = this.scale


        
        var credBox = this.add.group();
        credBox.add(this.makeButton(width / 4, height / 4, width / 2, height / 2, this.colorway['credBack2'], 15))
        credBox.add(this.makeButton(width / 4 + 10, height / 4 + 5, width / 2, height / 2, this.colorway['credBack'], 15))
        
        
        credBox.add(this.add.text(width / 4 + 45, height / 4 + 40, 'Thank you for playing!' 
            + '\n\nCreated By:'
            + '\n\t \tBianka Boudreaux' 
            + '\n\t \tGabriela Sigala Acosta' 
            + '\n\t \tIsmael Parra'
            + '\n\t \tAlexander Cabos', {fontFamily : 'Righteous', fontSize : '40px', color : '#' + this.colorway['credText']}))


        credBox.add(this.makeButton(width / 2 - 145, height / 2 + 120, width / 6, height / 12, this.colorway['backButton'], 15))
        credBox.add(this.makeButton(width / 2 - 140, height / 2 + 125, width / 6, height / 12, this.colorway['backButton2'], 15))

        credBox.add(this.add.text(width / 2 - 105, height / 2 + 150, 'Back to Menu', {
            fontFamily : 'Righteous', fontSize : '30px', color : '#' + this.colorway['backText']
        }).setInteractive().on('pointerdown', () => this.hideCredBox(credBox)))
        
    }
     
    hideCredBox(credBox) {
        console.log('hide');
        credBox.destroy(true)
    }
}


