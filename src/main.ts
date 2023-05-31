import Phaser from "phaser";
import StartScreen from "./scenes/startscreen"
import Game from "./scenes/game";
import UI from "./scenes/ui";
import GameOver from "./scenes/gameover"
import Players from "./scenes/players";


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: {
                y:0
            }
        }
    },
    scene: [StartScreen, Players, Game, UI, GameOver]   // this is the list of scenes to be used in the game, only the first scene is auto launched
};


export default new Phaser.Game(config)
