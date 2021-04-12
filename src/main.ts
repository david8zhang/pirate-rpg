import Phaser from 'phaser'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import UIScene from './scenes/UIScene'

const config: any = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  pixelArt: true,
  parent: 'phaser',
  dom: {
    createContainer: true,
  },
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
