import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class Players extends Phaser.Scene {
    constructor() {
        super('players');
    }
    
    bg;
    p1Button;
    p2Button;
    backButton;



    init() {
    }

    preload(){

        const fonts = new WebFontFile(this.load, 'Quicksand')
		this.load.addFile(fonts)

        const { width, height } = this.scale;

        var bgRect = new Phaser.Geom.Rectangle(0, 0, width, height)
        var bg = this.add.graphics({fillStyle: {color : 0x14213D } })
        bg.fillRoundedRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height, 0);


        // // width: 1600,
        // // height: 1000,
        // const place = height / 3; 

        // this.Player1ButtonBack = this.graphics = this.add.graphics();
        // this.Player1ButtonBack.fillStyle(0x81B29A, 1);
        // this.Player1ButtonBack.fillRoundedRect(width / 2 - 295, height / 3 + 195, 600, 150, 15);

        // this.Player1ButtonFront = this.graphics = this.add.graphics();
        // this.Player1ButtonFront.fillStyle(0x3D405B, 1);
        // this.Player1ButtonFront.fillRoundedRect(width / 2 - 300, height / 3 + 200, 600, 150, 15);

        // // PLAYER 2 
        // this.Player2ButtonBack = this.graphics = this.add.graphics();
        // this.Player2ButtonBack.fillStyle(0x81B29A, 1);
        // this.Player2ButtonBack.fillRoundedRect(width / 2 - 300, height / 3 - place + 200, 600, 150, 15);

        // this.Player2ButtonFront = this.graphics2 = this.add.graphics();
        // this.Player2ButtonFront.fillStyle(0x3D405B, 1);
        // this.Player2ButtonFront.fillRoundedRect(width / 2 - 300, height / 3 - place + 200, 600, 150, 15);


        // this.Player1ButtonText = this.add.text(width / 2 - 300 + 100, height / 3 - 75, '1 PLAYER', {
        //     fontSize: '75px', color: 'white'
        // });

        // this.Player2ButtonText = this.add.text(width / 2 - 300 + 100, height / 3 + place - 75, '2 PLAYERS', {
        //     fontSize: '75px', color: 'white'
        // });

        // // this.PlayerButtonText = this.add.text(width / 4, height / 2  '1 Player', {
        // //     fontSize: '75px', color: 'white'
        // // });

        // //this.Player2ButtonFront.setInteractive().on('pointerdown', () => (this.button2Click = true));

        // this.Player1ButtonBack.setInteractive().on('pointerdown', () => (this.buttonClick = true)); 
        // this.Player1ButtonFront.setInteractive().on('pointerdown', () => (this.buttonClick = true));
        // this.Player1ButtonText.setInteractive().on('pointerdown', () => (this.buttonClick = true )); 
       

    }

    create(){
        const { width, height } = this.scale

        var rect = new Phaser.Geom.Rectangle(width / 3, height / 4, width / 3, height / 8);
        
        this.p1Button = this.add.graphics({fillStyle : {color : 0xE5E5E5}})
        this.p1Button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, 15)
        .setInteractive().on('pointerdown', () => (this.p1Game(), console.log('boxclicked')));

        var p1Text = this.add.text(width / 3 + 95, height / 4 + 20, '1 PLAYER', {
            fontFamily : 'Quicksand', fontSize: '80px', color : '#000000'
        }).setInteractive().on('pointerdown', () => (this.p1Game()))

        this.p2Button = this.add.graphics({fillStyle : {color : 0xE5E5E5}})
        
        this.p2Button.fillRoundedRect(rect.x, rect.y * 2 + 20, rect.width, rect.height, 15)
        .setInteractive().on('pointerdown', () => (this.p2Game(), console.log('boxclicked')));
        

        var p2Text = this.add.text(width / 3 + 60, height / 2 + 40, '2 PLAYERS', {
            fontFamily : 'Quicksand', fontSize: '80px', color : '#000000'
        }).setInteractive().on('pointerdown', () => (this.p2Game()))
        

        
        var backRect = new Phaser.Geom.Rectangle(width * 5 / 6, height * 6 / 7, width / 8, height / 14 )

        this.backButton = this.add.graphics({fillStyle : {color : 0xE5E5E5}})
        this.backButton.fillRoundedRect(backRect.x, backRect.y, backRect.width, backRect.height, 15)
        .setInteractive().on('pointerdown', () => (this.backButton()))

        var backText = this.add.text(width * 5 / 6 + 40, height * 6 / 7 + 15, 'BACK', {
            fontFamily : 'Quicksand', fontSize : '40px', color : '#000000'
        }).setInteractive().on('pointerdown', () => (this.backButton()))
    }

    update() { }

    p1Game() {
        this.scene.start('game')
    }

    p2Game() {
        this.scene.start('game')
        
    } // needs way to indicate 2 players

    goBack() {
        this.scene.start('StartScreen')
    }
}