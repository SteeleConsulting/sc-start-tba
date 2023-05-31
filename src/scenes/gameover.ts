import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    init() {
    }

    preload(){

    }

    create(){
        events.on('gameover', () => {
            this.add.text(0, 0, 'Game Over!', {
                fontSize: '200px', color: 'white'
            });
        });
    }

    update() {

    }
}