import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";

export default class Levels2 extends Phaser.Scene {
    constructor() {
        super('levels2');
    }

    bg;
    l1Button;
    l2Button;
    backButton;

    colorway = {
        'bg': 0x1D3557,
        'l1Button1': 0x457B9D,
        'l1Button2': 0xE63946,
        'l2Button1': 0x457B9D,
        'l2Button2': 0xE63946,
        'back1': 0x457B9D,
        'back2': 0xE63946,
        'levelTitle': 'F1FAEE',
        'l1Text': 'F1FAEE',
        'l2Text': 'F1FAEE',
        'backText': 'F1FAEE'
    }


    init() {
    }

    preload() {
        console.log('went into levels');

        const fonts = new WebFontFile(this.load, 'Righteous')
        this.load.addFile(fonts)

        const { width, height } = this.scale;

        var bgRect = new Phaser.Geom.Rectangle(0, 0, width, height)
        var bg = this.add.graphics({ fillStyle: { color: 0x14213D } })
        bg.fillRoundedRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height, 0);

    }

    create() {
        const { width, height } = this.scale

        // page title
        this.add.text(width / 6, height / 5, 'SELECT LEVEL', {
            fontFamily: 'Righteous', fontSize: '80px', color: '#' + this.colorway['levelTitle']
        })

        // 1 Level game button
        this.makeButton(width / 3, height / 4 + 110, width / 3, height / 8, this.colorway['l1Button1'], 15)
        this.makeButton(width / 3 + 10, height / 4 + 115, width / 3, height / 8, this.colorway['l1Button2'], 15)

        this.add.text(width / 3 + 100, height / 4 + 135, 'Level 1 ', {
            fontFamily: 'Righteous', fontSize: '80px', color: '#' + this.colorway['l1Text']
        }).setInteractive().on('pointerdown', () => (this.l1Game()))

        // 2 level game button
        this.makeButton(width / 3, height / 2 + 130, width / 3, height / 8, this.colorway['l2Button1'], 15)
        this.makeButton(width / 3 + 10, height / 2 + 135, width / 3, height / 8, this.colorway['l2Button2'], 15)

        var p2Text = this.add.text(width / 3 + 65, height / 2 + 155, 'Level 2', {
            fontFamily: 'Righteous', fontSize: '80px', color: this.colorway['l2Text']
        }).setInteractive().on('pointerdown', () => (this.l2Game()))

        // back button
        this.makeButton(width * 5 / 6, height * 6 / 7, width / 8, height / 14, this.colorway['back1'], 15)
        this.makeButton(width * 5 / 6 + 10, height * 6 / 7 + 5, width / 8, height / 14, this.colorway['back2'], 15)

        this.add.text(width * 5 / 6 + 45, height * 6 / 7 + 15, 'BACK', {
            fontFamily: 'Righteous', fontSize: '40px', color: '#' + this.colorway['backText']
        }).setInteractive().on('pointerdown', () => (this.backButton()))
    }

    update() { }

    makeButton(x: number, y: number, w: number, h: number, objColor: number, curve: number) {
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({ fillStyle: { color: objColor } })
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }
    selectPlayers() {
        this.scene.start('players')
    }

    l1Game() {
        this.scene.start('2p_easy')
    }
    l2Game() {
        this.scene.start('2p_hard')
    }

    goBack() {
        this.scene.start('start')
    }
}