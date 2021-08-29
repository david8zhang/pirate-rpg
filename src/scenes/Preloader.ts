import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    // Fonts

    this.load.atlas('player', 'character/player.png', 'character/player.json')
    this.load.image('heart', 'ui/pixel-heart.png')

    // Plants
    this.load.spritesheet('palm-trees', 'plants/palm-trees.png', {
      frameHeight: 64,
      frameWidth: 64,
      startFrame: 0,
      endFrame: 1,
    })

    // Particles
    this.load.image('wood-particle', 'particles/wood-particle.png')
    this.load.image('blood-particle', 'particles/blood-particle.png')

    // Tiles
    this.load.image('beach-tiles', 'tiles/beach-tiles.png')
    this.load.image('panel', 'ui/grey_panel.png')
    this.load.image('tent-tiles', 'tiles/tent-tiles.png')
    this.load.image('elevated-tiles', 'tiles/elevated-tiles.png')
    this.load.tilemapTiledJSON('starter-island', 'tiles/starter-island.json')
    this.load.tilemapTiledJSON('starter-island-2', 'tiles/starter-island-2.json')
    this.load.tilemapTiledJSON('tent', 'tiles/tent.json')

    // Items
    this.load.image('coconut', 'items/coconut.png')
    this.load.image('crabclaw', 'items/crab-claw.png')
    this.load.image('stick', 'items/stick.png')
    this.load.image('rock', 'items/rock.png')
    this.load.image('wood', 'items/wood.png')
    this.load.image('palm-frond', 'items/palm-frond.png')

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
    this.load.atlas('skeleton', 'mobs/skeleton/skeleton.png', 'mobs/skeleton/skeleton.json')

    // Transport
    this.load.image('ship', 'items/pirate-ship1.png')
    this.load.image('rowboat', 'transport/rowboat.png')
    this.load.image('rowboat-up', 'transport/rowboat-up.png')
    this.load.image('rowboat-down', 'transport/rowboat-down.png')
    this.load.image('rowboat-inventory', 'transport/rowboat-inventory.png')

    // Sloop
    this.load.image('sloop-icon', 'transport/sloop/sloop-icon.png')
    this.load.image('sloop-side', 'transport/sloop/sloop-side.png')
    this.load.image('sloop-up', 'transport/sloop/sloop-up.png')
    this.load.image('sloop-down', 'transport/sloop/sloop-down.png')
    this.load.image('sails-side', 'transport/sloop/sails-side.png')
    this.load.image('sails-up', 'transport/sloop/sails-up.png')
    this.load.image('sails-down', 'transport/sloop/sails-down.png')
    this.load.image('wheel-up', 'transport/sloop/wheel-up.png')
    this.load.image('wheel-down', 'transport/sloop/wheel-down.png')
    this.load.image('wheel-side', 'transport/sloop/wheel-side.png')
    this.load.image('ladder-side', 'transport/sloop/ladder-side.png')
    this.load.image('ladder-up', 'transport/sloop/ladder-up.png')
    this.load.image('ladder-down', 'transport/sloop/ladder-down.png')
    this.load.image('cannon-side', 'transport/sloop/cannon-side.png')
    this.load.image('cannon-up', 'transport/sloop/cannon-up.png')
    this.load.image('cannon-down', 'transport/sloop/cannon-down.png')
    this.load.image('cannonball', 'transport/sloop/cannonball.png')

    // Sloop-animations
    this.load.atlas(
      'sloop',
      'transport/sloop/animations/sloop.png',
      'transport/sloop/animations/sloop.json'
    )

    // Sailboat
    this.load.image('sailboat', 'transport/sailboat/sailboat.png')

    // Structures
    this.load.image('tent', 'structures/tent.png')
    this.load.image('tent-inventory', 'structures/tent-inventory.png')

    // Splash-art for main menu
    this.load.image('splash', 'splash/splash-art.png')

    // Effects
    this.load.atlas(
      'explosion-small',
      'effects/explosion/explosion.png',
      'effects/explosion/explosion.json'
    )
    this.load.atlas(
      'cannon-flash',
      'effects/cannon/cannon-flash.png',
      'effects/cannon/cannon-flash.json'
    )
  }
  create() {
    this.scene.start('menu-ui')
  }
}
