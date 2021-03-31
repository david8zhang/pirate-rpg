import Phaser from 'phaser'
import { Constants } from '~/utils/Constants'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.bitmapFont('rainyhearts', 'fonts/rainyhearts.png', 'fonts/rainyhearts.xml')
    this.load.atlas('player', 'character/player.png', 'character/player.json')

    // Plants
    this.load.spritesheet('palm-trees', 'plants/palm-trees.png', {
      frameHeight: 64,
      frameWidth: 64,
      startFrame: 0,
      endFrame: 1,
    })

    // Tiles
    this.load.image('tiles', 'tiles/beach-tiles.png')
    this.load.image('panel', 'ui/grey_panel.png')
    this.load.tilemapTiledJSON('starter-island', 'tiles/starter-island.json')
    this.load.tilemapTiledJSON('starter-island-2', 'tiles/starter-island-2.json')

    // Items
    this.load.image('coconut', 'items/coconut.png')
    this.load.image('crabclaw', 'items/crab-claw.png')

    // Mobs
    this.load.atlas(
      'giantCrab',
      'mobs/giant-crab/giant_crab_atlas.png',
      'mobs/giant-crab/giant_crab_atlas.json'
    )
    this.load.atlas('monkey', 'mobs/monkey/monkey.png', 'mobs/monkey/monkey.json')
    this.load.atlas('crab', 'mobs/crab/crab.png', 'mobs/crab/crab.json')
  }
  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}
