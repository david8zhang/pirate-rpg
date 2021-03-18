import Phaser from 'phaser'
import { Constants } from '~/utils/Constants'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'tiles/beach-tiles.png')
    this.load.tilemapTiledJSON('starter-island', 'tiles/starter-island.json')
    this.load.atlas('player', 'character/texture.png', 'character/texture.json')
    this.load.image('coconut', 'plants/coconut.png')
    this.load.spritesheet('palm-trees', 'plants/palm-trees.png', {
      frameHeight: 64,
      frameWidth: 64,
      startFrame: 0,
      endFrame: 1,
    })
  }
  create() {
    this.scene.start('game')
  }
}
