import Phaser from 'phaser'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import UIScene from './scenes/UIScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
  },
  scale: {
    zoom: 2,
  },
  scene: [Preloader, Game, UIScene],
}

export default new Phaser.Game(config)
