import Phaser from "phaser";
import StartScreen from "./scenes/startscreen"
import UI from "./scenes/ui";
import GameOver from "./scenes/gameover"
import UI2 from "./scenes/ui2";
import PlayerSelect from "./scenes/player_select";
import Levels1 from "./scenes/levels1";
import Levels2 from "./scenes/levels2";
import Game1PEasy from "./scenes/game_1p_Easy";
import Game2PEasy from "./scenes/game_2p_Easy";
import Game1PHard from "./scenes/game_1p_Hard";
import Game2PHard from "./scenes/game_2p_Hard copy";


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
    scene: [StartScreen, PlayerSelect, Levels1, Levels2, Game1PEasy, Game2PEasy, Game1PHard, Game2PHard, UI, UI2, GameOver]   // this is the list of scenes to be used in the game, only the first scene is auto launched
};


export default new Phaser.Game(config)
