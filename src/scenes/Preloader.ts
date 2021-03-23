import Phaser from 'phaser'
import { Constants } from '~/utils/Constants'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.bitmapFont('rainyhearts', 'fonts/rainyhearts.png', 'fonts/rainyhearts.xml')
    this.load.image('tiles', 'tiles/beach-tiles.png')
    this.load.image('panel', 'ui/grey_panel.png')
    this.load.tilemapTiledJSON('starter-island', 'tiles/starter-island.json')
    this.load.atlas('player', 'character/player.png', 'character/player.json')
    this.load.image('coconut', 'plants/coconut.png')
    this.load.spritesheet('palm-trees', 'plants/palm-trees.png', {
      frameHeight: 64,
      frameWidth: 64,
      startFrame: 0,
      endFrame: 1,
    })

    // Mobs
    this.load.atlas(
      'giantCrab',
      'mobs/giant-crab/giant_crab_atlas.png',
      'mobs/giant-crab/giant_crab_atlas.json'
    )
    this.load.atlas('crab', 'mobs/crab/crab.png', 'mobs/crab/crab.json')
  }
  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}
