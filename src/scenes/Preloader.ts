import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'tiles/beach-tiles.png')
    this.load.tilemapTiledJSON('starter-island', 'tiles/starter-island.json')
    this.load.atlas('player', 'character/texture.png', 'character/texture.json')
  }

  create() {
    this.scene.start('game')
  }
}
