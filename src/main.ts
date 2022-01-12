import Phaser from 'phaser'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import { ShipUIScene } from './scenes/ShipUIScene'
import GameUIScene from './scenes/GameUIScene'
import { MainMenuScene } from './scenes/MainMenuScene'

const config: any = {
  antialias: false,
  type: Phaser.AUTO,
  width: 600,
  height: 375,
  parent: 'phaser',
  pixelArt: true,
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
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, Game, MainMenuScene, GameUIScene, ShipUIScene],
}

export default new Phaser.Game(config)
