import Phaser from 'phaser'
import WebFontFile from '~/files/WebFontFile'
import { Constants } from '~/utils/Constants'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    // Fonts
    const fonts = new WebFontFile(this.load, ['Poor Story'])
    this.load.addFile(fonts)

    this.load.atlas('player', 'character/player.png', 'character/player.json')
    this.load.image('heart', 'ui/pixel-heart.png')

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
    this.load.image('stick', 'items/stick.png')
    this.load.image('rock', 'items/rock.png')

    // Weapons
    this.load.image('axe', 'weapons/axe.png')
    this.load.image('axe-inventory', 'weapons/axe-inventory.png')

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
