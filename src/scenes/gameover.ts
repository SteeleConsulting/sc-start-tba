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

        this.makeButton(width * 2/7, height * 3 / 5, width / 4, height / 6, 0xFFFFFF, 15)
        this.makeButton(width / 3 - 10, height / 4 - 5, width / 3, height / 4, 0xFFFF55, 15)
        this.add.text(width / 3 + 15, height / 4 + 10, 'RESTART', {fontFamily : 'Quicksand', fontSize : '30px', color : '#000000'})
        
    }

    update() {

    }

    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }
}