import Phaser, { NONE, Physics } from "phaser";
import { sharedInstance as events, sharedInstance } from "../helpers/eventCenter";
import WebFontFile from "~/WebFontFile";


export default class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    colorway = {
        'restart1': 0xE63946,
        'restart2': 0x457B9D,
        'restartText': 'F1FAEE',
        'victory': 'F1FAEE',
        'gameover': 'E63946'
    }

    init() {
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Righteous')
        this.load.addFile(fonts)
    }

    create() {
        let { width, height } = this.scale


        console.log('gameover')
        this.add.text(width / 6 - 10, height / 5, 'GAME OVER', {
            fontFamily: 'Righteous', fontSize: '190px', color: 'white'
        });


        events.on('victory', () => {
             this.add.text(width / 6 - 10, height / 5, 'YOU WIN', {
                fontFamily : 'Righteous', fontSize: '190px', color: 'white'
             })
        });

        this.makeButton(width * 5 / 12 - 40, height / 2 - 5, width / 5, height / 9, this.colorway['restart2'], 15)
        this.makeButton(width * 5 / 12 - 30, height / 2, width / 5, height / 9, this.colorway['restart1'], 15)


        this.makeButton(width * 4 / 12 - 20, height * 4 / 6 - 5, width / 3, height / 9, this.colorway['restart2'], 15)
        this.makeButton(width * 4 / 12 - 10, height * 4 / 6, width / 3, height / 9, this.colorway['restart1'], 15)
        this.add.text(width * 5 / 12, height * 3 / 6 + 25, 'RESTART', {
            fontFamily: 'Righteous', fontSize: '60px', color: '#' + this.colorway['restartText']
        }).setInteractive().on('pointerdown', () => (this.restartStage()))

        this.add.text(width * 4 / 12 + 30, height * 4 / 6 + 25, 'BACK TO START', {
            fontFamily: 'Righteous', fontSize: '60px', color: '#' + this.colorway['restartText']
        }).setInteractive().on('pointerdown', () => (this.backToStart()))


    }

    update() {

    }

    makeButton(x: number, y: number, w: number, h: number, objColor: number, curve: number) {
        const { width, height } = this.scale;

        var rect = new Phaser.Geom.Rectangle(x, y, w, h)
        var button = this.add.graphics({ fillStyle: { color: objColor } })
        button.fillRoundedRect(rect.x, rect.y, rect.width, rect.height, curve)
        return button
    }


    restartStage() {

        if (this.scene.isActive('1p_easy')) {
            this.scene.stop('1p_easy').stop('1p_hard').stop('2p_easy')
                .stop('2p_hard').start('1p_easy')

        } else if (this.scene.isActive('1p_hard')) {
            this.scene.stop('1p_easy').stop('1p_hard').stop('2p_easy')
                .stop('2p_hard').start('1p_hard')

        } else if (this.scene.isActive('2p_easy')) {
            this.scene.stop('1p_easy').stop('1p_hard').stop('2p_easy')
                .stop('2p_hard').start('2p_easy')

        } else if (this.scene.isActive('2p_hard')) {
            this.scene.stop('1p_easy').stop('1p_hard').stop('2p_easy')
                .stop('2p_hard').start('2p_hard')

        } else {
            this.scene.stop('1p_easy').stop('1p_hard').stop('2p_easy')
                .stop('2p_hard').stop('1p_easy').start('start')
        }
    }

    backToStart() {
        this.scene.stop('1p_easy').stop('2p_easy')
            .stop('1p_hard').stop('2p_hard').stop('ui').stop('ui2').start('start')
    }
}