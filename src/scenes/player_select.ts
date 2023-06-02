import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class PlayerSelect extends Phaser.Scene {
    constructor() {
        super('player_select');
    }
    

    colorway = {
        'bg' : 0x1D3557,
        'p1Button1' : 0x457B9D,
        'p1Button2' : 0xE63946,
        'p2Button1' : 0x457B9D,
        'p2Button2' : 0xE63946,        
        'back1' : 0x457B9D,
        'back2' : 0xE63946,
        'playersTitle' : 'F1FAEE',
        'p1Text' : 'F1FAEE',
        'p2Text' : 'F1FAEE',
        'backText' : 'F1FAEE'
    }


    init() {
    }

    preload(){

        const fonts = new WebFontFile(this.load, 'Righteous')
		this.load.addFile(fonts)

        const { width, height } = this.scale;

        var bgRect = new Phaser.Geom.Rectangle(0, 0, width, height)
        var bg = this.add.graphics({fillStyle: {color : this.colorway['bg'] } })
        bg.fillRoundedRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height, 0);

    }

    create(){
        const { width, height } = this.scale

        // page title
        this.add.text(width / 6, height / 5, 'SELECT NUMBER OF PLAYERS', {
            fontFamily : 'Righteous', fontSize: '80px', color : '#' + this.colorway['playersTitle']
        })
        
        // 1 player game button
        this.makeButton(width / 3, height / 4 + 110, width / 3, height / 8, this.colorway['p1Button1'], 15)
        this.makeButton(width / 3 + 10, height / 4 + 115, width / 3, height / 8, this.colorway['p1Button2'], 15)

        this.add.text(width / 3 + 100, height / 4 + 135, '1 PLAYER', {
            fontFamily : 'Righteous', fontSize: '80px', color : '#' + this.colorway['p1Text']
        }).setInteractive().on('pointerdown', () => (this.p1Game()))

        // 2 player game button
        this.makeButton(width / 3, height  / 2 + 130, width / 3, height / 8, this.colorway['p2Button1'], 15)
        this.makeButton(width / 3 + 10, height  / 2 + 135, width / 3, height / 8, this.colorway['p2Button2'], 15)

        var p2Text = this.add.text(width / 3 + 65, height / 2 + 155, '2 PLAYERS', {
            fontFamily : 'Righteous', fontSize: '80px', color : '#' + this.colorway['p2Text']
        }).setInteractive().on('pointerdown', () => (this.p2Game()))
        
        // back button
        this.makeButton(width * 5 / 6, height * 6 / 7, width / 8, height / 14, this.colorway['back1'], 15)
        .setInteractive().on('pointerdown', () => (this.goBack()))
        this.makeButton(width * 5 / 6 + 10, height * 6 / 7 + 5, width / 8, height / 14, this.colorway['back2'], 15)
        .setInteractive().on('pointerdown', () => (this.goBack()))

        this.add.text(width * 5 / 6 + 45, height * 6 / 7 + 15, 'BACK', {
            fontFamily : 'Righteous', fontSize : '40px', color : '#' + this.colorway['backText']
        }).setInteractive().on('pointerdown', () => (this.goBack()))
    }

    update() { }

    makeButton(x : number, y : number, w : number, h : number, objColor : number, curve: number){
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({fillStyle : {color : objColor}})
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }

    p1Game() {
        this.scene.start('levels1')
    }

    p2Game() {
        this.scene.start('levels2')
        //events.emit('two-players');
    } // needs way to indicate 2 players

    goBack() {
        this.scene.start('start')
    }
}