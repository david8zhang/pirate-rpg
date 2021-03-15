import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  physics: {
    default: 'arcade',
    // arcade: {
    //   debug: true,
    // },
  },
  scale: {
    zoom: 2,
  },
  scene: [Preloader, Game],
}

export default new Phaser.Game(config)
