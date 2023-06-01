import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    init() {
    }

    preload(){
        const fonts = new WebFontFile(this.load, 'Quicksand')
		this.load.addFile(fonts)
    }

    create(){
        let {width, height} = this.scale
        events.on('gameover', () => {
            this.add.text(width / 2 - 600, height /  5, 'GAME OVER', {
                fontFamily : 'Quicksand', fontSize: '200px', color: 'white'
            });
        });
    }

    update() {

    }
}