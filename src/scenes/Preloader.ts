import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    // Fonts
    this.load.atlas('player', 'character/player.png', 'character/player.json')
    this.load.image('heart', 'ui/pixel-heart.png')
    this.load.image('lightning-bolt', 'ui/pixel-lightning.png')

    // Plants
    this.load.image('palm-tree-with-coconut', 'harvestables/palm-tree/palm-tree_with_coconut.png')
    this.load.image(
      'palm-tree-without-coconut',
      'harvestables/palm-tree/palm-tree_without_coconut.png'
    )
    this.load.image('boulder', 'harvestables/boulder.png')
    this.load.image(
      'banana-tree-with-banana',
      'harvestables/banana-tree/banana-tree_with_banana.png'
    )
    this.load.image(
      'banana-tree-without-banana',
      'harvestables/banana-tree/banana-tree_without_banana.png'
    )

    // Particles
    this.load.image('wood-particle', 'particles/wood-particle.png')
    this.load.image('blood-particle', 'particles/blood-particle.png')
    this.load.image('stone-particle', 'particles/stone-particle.png')

    // Tiles
    this.load.image('beach-tiles', 'tiles/beach-tiles.png')
    this.load.image('panel', 'ui/grey_panel.png')
    this.load.image('tent-tiles', 'tiles/tent-tiles.png')
    this.load.tilemapTiledJSON('map1', 'tiles/map1.json')
    this.load.tilemapTiledJSON('map2', 'tiles/map2.json')
    this.load.tilemapTiledJSON('map3', 'tiles/map3.json')
    this.load.tilemapTiledJSON('map4', 'tiles/map4.json')
    this.load.tilemapTiledJSON('tent', 'tiles/tent.json')

    // Items
    this.load.image('coconut', 'items/coconut.png')
    this.load.image('crabclaw', 'items/crab-claw.png')
    this.load.image('stick', 'items/stick.png')
    this.load.image('rock', 'items/rock.png')
    this.load.image('wood', 'items/wood.png')
    this.load.image('palm-frond', 'items/palm-frond.png')
    this.load.image('iron-ore', 'items/iron-ore.png')
    this.load.image('iron-bar', 'items/iron-bar.png')
    this.load.image('rope', 'items/rope.png')
    this.load.image('canvas', 'items/canvas.png')
    this.load.image('banana', 'items/banana.png')

    // Weapons
    this.load.image('axe', 'weapons/axe/axe.png')
    this.load.image('axe-diag', 'weapons/axe/axe-diag.png')
    this.load.image('axe-inventory', 'weapons/axe/axe-inventory.png')
    this.load.image('sword', 'weapons/sword/sword.png')
    this.load.image('sword-diag', 'weapons/sword/sword-diag.png')
    this.load.image('sword-inventory', 'weapons/sword/sword-inventory.png')
    this.load.image('wood-club', 'weapons/wood-club/wood-club.png')
    this.load.image('wood-club-diag', 'weapons/wood-club/wood-club-diag.png')
    this.load.image('wood-club-inventory', 'weapons/wood-club/wood-club-inventory.png')

    // Mobs
    this.load.atlas(
      'giantCrab',
      'mobs/giant-crab/giant_crab_atlas.png',
      'mobs/giant-crab/giant_crab_atlas.json'
    )
    this.load.atlas('monkey', 'mobs/monkey/monkey.png', 'mobs/monkey/monkey.json')
    this.load.atlas('crab', 'mobs/crab/crab.png', 'mobs/crab/crab.json')
    this.load.atlas('skeleton', 'mobs/skeleton/skeleton.png', 'mobs/skeleton/skeleton.json')
    this.load.atlas(
      'navy-sailor',
      'mobs/navy-sailor/navy-sailor.png',
      'mobs/navy-sailor/navy-sailor.json'
    )

    // Common ship objects
    this.load.image('wheel-up', 'transport/common/wheel-up.png')
    this.load.image('wheel-down', 'transport/common/wheel-down.png')
    this.load.image('wheel-side', 'transport/common/wheel-side.png')
    this.load.image('ladder-side', 'transport/common/ladder-side.png')
    this.load.image('ladder-up', 'transport/common/ladder-up.png')
    this.load.image('ladder-down', 'transport/common/ladder-down.png')
    this.load.image('cannon-side', 'transport/common/cannon-side.png')
    this.load.image('cannon-up', 'transport/common/cannon-up.png')
    this.load.image('cannon-down', 'transport/common/cannon-down.png')
    this.load.image('cannonball', 'transport/common/cannonball.png')

    // brig
    this.load.image('brig-icon', 'transport/brig/brig-icon.png')
    this.load.image('brig-side', 'transport/brig/brig-side.png')
    this.load.image('brig-up', 'transport/brig/brig-up.png')
    this.load.image('brig-down', 'transport/brig/brig-down.png')
    this.load.image('sails-side', 'transport/brig/sails-side.png')
    this.load.image('sails-up', 'transport/brig/sails-up.png')
    this.load.image('sails-down', 'transport/brig/sails-down.png')
    this.load.atlas(
      'brig',
      'transport/brig/animations/brig.png',
      'transport/brig/animations/brig.json'
    )

    // Sailboat
    this.load.image('sailboat-down', 'transport/sailboat/sailboat-down.png')
    this.load.image('sailboat-up', 'transport/sailboat/sailboat-up.png')
    this.load.image('sailboat-side', 'transport/sailboat/sailboat-side.png')
    this.load.image('sailboat-preview', 'transport/sailboat/sailboat-preview.png')
    this.load.image('sailboat-sails-side', 'transport/sailboat/sailboat-sails-side.png')
    this.load.image('sailboat-sails-up', 'transport/sailboat/sailboat-sails-up.png')
    this.load.image('sailboat-sails-down', 'transport/sailboat/sailboat-sails-down.png')
    this.load.image('sailboat-ladder-side', 'transport/sailboat/sailboat-ladder-side.png')
    this.load.image('sailboat-ladder-down', 'transport/sailboat/sailboat-ladder-down.png')
    this.load.image('sailboat-ladder-up', 'transport/sailboat/sailboat-ladder-up.png')
    this.load.atlas(
      'sailboat',
      'transport/sailboat/sailboat.png',
      'transport/sailboat/sailboat.json'
    )
    this.load.image('sailboat-inventory-sails', 'items/sailboat-sail.png')
    this.load.image('sailboat-inventory-hull', 'items/sailboat-hull.png')
    this.load.image('sailboat-inventory', 'items/sailboat.png')

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
      'explosion-large',
      'effects/explosion/big-explosion.png',
      'effects/explosion/big-explosion.json'
    )
    this.load.atlas(
      'cannon-flash',
      'effects/cannon/cannon-flash.png',
      'effects/cannon/cannon-flash.json'
    )
    this.load.image('slash-1', 'weapons/effects/slash-1.png')
    this.load.image('slash-2', 'weapons/effects/slash-2.png')
  }
  create() {
    this.scene.start('menu-ui')
  }
}
