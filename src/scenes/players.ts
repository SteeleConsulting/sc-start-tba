import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class Players extends Phaser.Scene {
    constructor() {
        super('players');
    }
    
    graphics;
    Player1ButtonBack;
    Player1ButtonFront;
    Player1ButtonText;
    buttonClick = false; 

    graphics2; 
    Player2ButtonBack; 
    Player2ButtonFront; 
    Player2ButtonText; 
    button2Click = false; 



    init() {
    }

    preload(){
        const { width, height } = this.scale;

        // width: 1600,
        // height: 1000,
        const place = height / 3; 

        this.Player1ButtonBack = this.graphics = this.add.graphics();
        this.Player1ButtonBack.fillStyle(0x81B29A, 1);
        this.Player1ButtonBack.fillRoundedRect(width / 2 - 295, height / 3 + 195, 600, 150, 15);

        this.Player1ButtonFront = this.graphics = this.add.graphics();
        this.Player1ButtonFront.fillStyle(0x3D405B, 1);
        this.Player1ButtonFront.fillRoundedRect(width / 2 - 300, height / 3 + 200, 600, 150, 15);

        // PLAYER 2 
        this.Player2ButtonBack = this.graphics = this.add.graphics();
        this.Player2ButtonBack.fillStyle(0x81B29A, 1);
        this.Player2ButtonBack.fillRoundedRect(width / 2 - 300, height / 3 - place + 200, 600, 150, 15);

        this.Player2ButtonFront = this.graphics2 = this.add.graphics();
        this.Player2ButtonFront.fillStyle(0x3D405B, 1);
        this.Player2ButtonFront.fillRoundedRect(width / 2 - 300, height / 3 - place + 200, 600, 150, 15);


        this.Player1ButtonText = this.add.text(width / 2 - 300 + 100, height / 3 - 75, '1 PLAYER', {
            fontSize: '75px', color: 'white'
        });

        this.Player2ButtonText = this.add.text(width / 2 - 300 + 100, height / 3 + place - 75, '2 PLAYERS', {
            fontSize: '75px', color: 'white'
        });

        // this.PlayerButtonText = this.add.text(width / 4, height / 2  '1 Player', {
        //     fontSize: '75px', color: 'white'
        // });

        //this.Player2ButtonFront.setInteractive().on('pointerdown', () => (this.button2Click = true));

        this.Player1ButtonBack.setInteractive().on('pointerdown', () => (this.buttonClick = true)); 
        this.Player1ButtonFront.setInteractive().on('pointerdown', () => (this.buttonClick = true));
        this.Player1ButtonText.setInteractive().on('pointerdown', () => (this.buttonClick = true )); 
       

    }

    create(){
    }

    update() {
        if(this.buttonClick == true){
            console.log('1 player button clicked')
            this.scene.start('game')
            this.buttonClick = false
        }

        // if(this.button2Click == true){
        //     console.log('2 players button clicked')
        //     this.scene.start('game')
        //     this.button2Click = false
        // }
    }
}