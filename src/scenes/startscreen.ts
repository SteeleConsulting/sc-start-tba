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
    buttonClick = false

    init() {
    }

    preload(){
        const { width, height } = this.scale;

        this.startButtonBack = this.graphics = this.add.graphics();
        this.startButtonBack.fillStyle(0x81B29A, 1);
        this.startButtonBack.fillRoundedRect(width / 2 - 308, height / 2 - 8, 600, 150, 15);

        this.startButtonFront = this.graphics = this.add.graphics();
        this.startButtonFront.fillStyle(0x3D405B, 1);
        this.startButtonFront.fillRoundedRect(width / 2 - 300, height / 2, 600, 150, 15);

        this.startButtonText = this.add.text(width / 2 - 225, height / 2 + 40, 'START GAME', {
            fontSize: '75px', color: 'white'
        });

        
        this.startButtonBack.setInteractive().on('pointerdown', () => (this.buttonClick = true))
        this.startButtonFront.setInteractive().on('pointerdown', () => (this.buttonClick = true));
        this.startButtonText.setInteractive().on('pointerdown', () => (this.buttonClick = true ))

    }

    create(){
    }

    update() {
        if(this.buttonClick == true){
            console.log('start button clicked')
            this.scene.start('players')
            this.buttonClick = false
        }
    }
}


