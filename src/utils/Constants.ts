import { Direction } from '~/characters/Player'
import { Harvestable } from '../objects/Harvestable'
import { ItemConfig, ItemTypes } from '../objects/ItemConfig'

export class Constants {
  static get TILE_SIZE() {
    return 16
  }
  static get BG_HEIGHT() {
    return 100 * Constants.TILE_SIZE
  }
  static get BG_WIDTH() {
    return 100 * Constants.TILE_SIZE
  }
  static get ATTACK_DURATION() {
    return 400
  }
  static get WEAPON_SWING_DURATION() {
    return 300
  }

  static getMob(mobName: string) {
    return ALL_MOBS.find((mobConfig) => mobConfig.name === mobName)
  }

  static getItem(itemName: string) {
    return ALL_ITEMS.find((itemConfig) => itemConfig.name === itemName)
  }

  static getShip(shipName: string) {
    return ALL_SHIP_TYPES.find((shipConfig) => shipConfig.name === shipName)
  }
}

export enum AnimationType {
  IDLE_FRONT = 'idleFront',
  IDLE_BACK = 'idleBack',
  IDLE_SIDE = 'idleSide',
  WALK_FRONT = 'walkFront',
  WALK_SIDE = 'walkSide',
  WALK_BACK = 'walkBack',
  HURT_FRONT = 'hurtFront',
  HURT_BACK = 'hurtBack',
  HURT_SIDE = 'hurtSide',
  ATTACK_FRONT = 'attackFront',
  ATTACK_SIDE = 'attackSide',
  ATTACK_BACK = 'attackBack',
  DIE_FRONT = 'dieFront',
  DIE_BACK = 'dieBack',
  DIE_SIDE = 'dieSide',
}

export const ALL_SHIP_TYPES = [
  {
    defaultHealth: 1000,
    name: 'Sloop',
    hullImages: {
      up: 'sloop-up',
      down: 'sloop-down',
      side: 'sloop-side',
    },
    sailsImages: {
      up: 'sails-up',
      down: 'sails-down',
      side: 'sails-side',
    },
    hullBodyConfig: {
      left: {
        xOffset: 0.2,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      right: {
        xOffset: 1.0,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      up: {
        xOffset: 0.35,
        yOffset: 0.3,
        width: 0.3,
        height: 0.7,
      },
      down: {
        xOffset: 0.33,
        yOffset: 0.25,
        width: 0.3,
        height: 0.7,
      },
    },
    wheelConfig: {
      up: {
        image: 'wheel-up',
        xOffset: 0,
        yOffset: 281,
      },
      left: {
        image: 'wheel-side',
        xOffset: 233,
        yOffset: 128,
      },
      right: {
        image: 'wheel-side',
        xOffset: -233,
        yOffset: 128,
      },
      down: {
        image: 'wheel-down',
        xOffset: -16,
        yOffset: -122,
      },
    },
    colliderConfig: {
      left: [
        {
          xOffset: 80,
          yOffset: 70,
          width: 190,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 80,
          yOffset: 235,
          width: 190,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -55,
          yOffset: 125,
          width: 2,
          height: 100,
          type: 'wall',
        },
        {
          xOffset: 210,
          yOffset: 125,
          width: 2,
          height: 100,
          type: 'wall',
        },
        {
          xOffset: -25,
          yOffset: 55,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 40,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 100,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 182,
          yOffset: 55,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 205,
          yOffset: 40,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 200,
          yOffset: 100,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -40,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -15,
          yOffset: 235,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 220,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 195,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 175,
          yOffset: 235,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 200,
          yOffset: 220,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -90,
          yOffset: 205,
          width: 80,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 190,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 170,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 160,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 150,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -200,
          yOffset: 130,
          width: 2,
          height: 20,
          type: 'wall',
        },
        {
          xOffset: -90,
          yOffset: 40,
          width: 80,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 190,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 170,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 80,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 90,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 50,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 60,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 70,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 80,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 90,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -205,
          yOffset: 105,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 250,
          yOffset: 40,
          width: 65,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 250,
          yOffset: 205,
          width: 65,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 270,
          yOffset: 120,
          width: 2,
          height: 150,
          type: 'wall',
        },
      ],
      right: [
        {
          xOffset: -80,
          yOffset: 70,
          width: 190,
          height: 2,
        },
        {
          xOffset: -80,
          yOffset: 235,
          width: 190,
          height: 2,
        },
        {
          xOffset: -175,
          yOffset: 60,
          width: 20,
          height: 2,
        },
        {
          xOffset: -185,
          yOffset: 50,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 40,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 100,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 90,
          width: 20,
          height: 2,
        },
        {
          xOffset: -267,
          yOffset: 49,
          width: 20,
          height: 2,
        },
        {
          xOffset: -235,
          yOffset: 40,
          width: 48,
          height: 2,
        },
        {
          xOffset: -210,
          yOffset: 135,
          width: 2,
          height: 70,
        },
        {
          xOffset: -200,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: -185,
          yOffset: 190,
          width: 10,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 222,
          width: 20,
          height: 2,
        },
        {
          xOffset: -235,
          yOffset: 205,
          width: 50,
          height: 2,
        },
        {
          xOffset: -275,
          yOffset: 195,
          width: 20,
          height: 2,
        },
        {
          xOffset: -275,
          yOffset: 120,
          width: 2,
          height: 130,
        },
        {
          xOffset: 20,
          yOffset: 62,
          width: 20,
          height: 2,
        },
        {
          xOffset: 30,
          yOffset: 54,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 46,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: 90,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: 25,
          yOffset: 190,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 225,
          width: 20,
          height: 2,
        },
        {
          xOffset: 94,
          yOffset: 208,
          width: 80,
          height: 2,
        },
        {
          xOffset: 95,
          yOffset: 40,
          width: 80,
          height: 2,
        },
        {
          xOffset: 55,
          yOffset: 130,
          width: 2,
          height: 80,
        },
        {
          xOffset: 150,
          yOffset: 50,
          width: 20,
          height: 2,
        },
        {
          xOffset: 165,
          yOffset: 65,
          width: 20,
          height: 2,
        },
        {
          xOffset: 180,
          yOffset: 80,
          width: 20,
          height: 2,
        },
        {
          xOffset: 195,
          yOffset: 95,
          width: 20,
          height: 2,
        },
        {
          xOffset: 200,
          yOffset: 126,
          width: 2,
          height: 30,
        },
        {
          xOffset: 195,
          yOffset: 150,
          width: 20,
          height: 2,
        },
        {
          xOffset: 180,
          yOffset: 165,
          width: 20,
          height: 2,
        },
        {
          xOffset: 165,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: 150,
          yOffset: 195,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: 103,
          width: 20,
          height: 2,
        },
      ],
      up: [
        {
          xOffset: -88,
          yOffset: 120,
          width: 2,
          height: 400,
        },
        {
          xOffset: 85,
          yOffset: 120,
          width: 2,
          height: 400,
        },
        {
          xOffset: 5,
          yOffset: 335,
          width: 125,
          height: 2,
        },
        {
          xOffset: -75,
          yOffset: 325,
          width: 20,
          height: 2,
        },
        {
          xOffset: 80,
          yOffset: 325,
          width: 20,
          height: 2,
        },
        {
          xOffset: 2,
          yOffset: 265,
          width: 80,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 250,
          width: 2,
          height: 25,
        },
        {
          xOffset: -38,
          yOffset: 250,
          width: 2,
          height: 25,
        },
        {
          xOffset: 1,
          yOffset: 20,
          width: 80,
          height: 2,
        },
        {
          xOffset: -38,
          yOffset: 41,
          width: 2,
          height: 65,
        },
        {
          xOffset: 42,
          yOffset: 38,
          width: 2,
          height: 65,
        },
        {
          xOffset: 1,
          yOffset: 8,
          width: 80,
          height: 2,
        },
        {
          xOffset: -72,
          yOffset: -90,
          width: 20,
          height: 2,
        },
        {
          xOffset: -59,
          yOffset: -100,
          width: 20,
          height: 2,
        },
        {
          xOffset: -50,
          yOffset: -110,
          width: 20,
          height: 2,
        },
        {
          xOffset: -40,
          yOffset: -120,
          width: 20,
          height: 2,
        },
        {
          xOffset: -30,
          yOffset: -130,
          width: 20,
          height: 2,
        },
        {
          xOffset: 2,
          yOffset: -140,
          width: 40,
          height: 2,
        },
        {
          xOffset: 35,
          yOffset: -130,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: -120,
          width: 20,
          height: 2,
        },
        {
          xOffset: 56,
          yOffset: -110,
          width: 20,
          height: 2,
        },
        {
          xOffset: 65,
          yOffset: -100,
          width: 20,
          height: 2,
        },
        {
          xOffset: 78,
          yOffset: -87,
          width: 20,
          height: 2,
        },
      ],
      down: [
        {
          xOffset: -100,
          yOffset: 45,
          height: 400,
          width: 2,
        },
        {
          xOffset: 70,
          yOffset: 45,
          height: 400,
          width: 2,
        },
        {
          xOffset: -15,
          yOffset: -99,
          height: 2,
          width: 80,
        },
        {
          xOffset: -15,
          yOffset: 160,
          height: 2,
          width: 80,
        },
        {
          xOffset: -55,
          yOffset: -65,
          height: 70,
          width: 2,
        },
        {
          xOffset: 25,
          yOffset: -65,
          height: 70,
          width: 2,
        },
        {
          xOffset: -18,
          yOffset: -170,
          height: 2,
          width: 140,
        },
        {
          xOffset: -90,
          yOffset: -160,
          height: 2,
          width: 20,
        },
        {
          xOffset: 60,
          yOffset: -160,
          height: 2,
          width: 20,
        },
        {
          xOffset: -55,
          yOffset: 145,
          height: 25,
          width: 2,
        },
        {
          xOffset: 25,
          yOffset: 145,
          height: 25,
          width: 2,
        },
        {
          xOffset: -89,
          yOffset: 255,
          height: 2,
          width: 20,
        },
        {
          xOffset: -78,
          yOffset: 265,
          height: 2,
          width: 20,
        },
        {
          xOffset: -67,
          yOffset: 275,
          height: 2,
          width: 20,
        },
        {
          xOffset: -56,
          yOffset: 286,
          height: 2,
          width: 20,
        },
        {
          xOffset: -44,
          yOffset: 300,
          height: 2,
          width: 20,
        },
        {
          xOffset: -16,
          yOffset: 310,
          height: 2,
          width: 40,
        },
        {
          xOffset: 11,
          yOffset: 300,
          height: 2,
          width: 20,
        },
        {
          xOffset: 30,
          yOffset: 286,
          height: 2,
          width: 20,
        },
        {
          xOffset: 39,
          yOffset: 275,
          height: 2,
          width: 20,
        },
        {
          xOffset: 50,
          yOffset: 265,
          height: 2,
          width: 20,
        },
        {
          xOffset: 59,
          yOffset: 255,
          height: 2,
          width: 20,
        },
        {
          xOffset: -15,
          yOffset: -82,
          height: 2,
          width: 80,
        },
      ],
    },
    hitboxConfig: {
      left: [
        {
          xOffset: -37,
          yOffset: 80,
          width: 264,
          height: 231,
        },
        {
          xOffset: -140,
          yOffset: 50,
          width: 100,
          height: 251,
        },
        {
          xOffset: 205,
          yOffset: 50,
          width: 100,
          height: 251,
        },
      ],
      right: [
        {
          xOffset: -270,
          yOffset: 50,
          width: 100,
          height: 231,
        },
        {
          xOffset: -171,
          yOffset: 80,
          width: 264,
          height: 231,
        },
        {
          xOffset: 75,
          yOffset: 50,
          width: 100,
          height: 251,
        },
      ],
      up: [
        {
          xOffset: -75,
          yOffset: -100,
          height: 540,
          width: 185,
        },
      ],
      down: [
        {
          xOffset: -90,
          yOffset: -160,
          height: 540,
          width: 185,
        },
      ],
    },
    ladderConfig: {
      up: {
        image: 'ladder-up',
        xOffset: 85,
        yOffset: 150,
      },
      down: {
        image: 'ladder-down',
        xOffset: -102,
        yOffset: 60,
      },
      left: {
        image: 'ladder-side',
        xOffset: 91,
        yOffset: 263,
      },
      right: {
        image: 'ladder-side',
        xOffset: -65,
        yOffset: 263,
      },
    },
    cannonConfig: {
      left: [
        {
          direction: Direction.UP,
          x: 13,
          y: 80,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.UP,
          x: 148,
          y: 80,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.DOWN,
          x: 13,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
        {
          direction: Direction.DOWN,
          x: 148,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
      ],
      right: [
        {
          direction: Direction.UP,
          x: -142,
          y: 82,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.UP,
          x: -3,
          y: 82,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.DOWN,
          x: -142,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
        {
          direction: Direction.DOWN,
          x: -3,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
      ],
      up: [
        {
          direction: Direction.RIGHT,
          x: 65,
          y: 95,
          body: {
            width: 1.5,
          },
          scaleX: 1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.RIGHT,
          x: 65,
          y: 200,
          body: {
            width: 1.5,
          },
          scaleX: 1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -70,
          y: 95,
          body: {
            offsetX: 80,
            width: 1.5,
          },
          scaleX: -1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -70,
          y: 200,
          body: {
            offsetX: 80,
            width: 1.5,
          },
          scaleX: -1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
      ],
      down: [
        {
          direction: Direction.RIGHT,
          x: 50,
          y: -5,
          scaleX: 1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
          },
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.RIGHT,
          x: 50,
          y: 95,
          scaleX: 1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
          },
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -80,
          y: 95,
          scaleX: -1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
            offsetX: 100,
          },
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -80,
          y: -5,
          scaleX: -1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
            offsetX: 100,
          },
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
      ],
    },
    centerOffset: {
      right: {
        x: -57,
        y: 153,
      },
      up: {
        x: 2,
        y: 149,
      },
      down: {
        x: -13,
        y: 30,
      },
      left: {
        x: 75,
        y: 150,
      },
    },
  },
]

export const ALL_HARVESTABLES = [
  {
    name: 'PalmTree',
    texture: 'palm-trees',
    health: 100,
    defaultFrame: 1,
    onDropItem: (harvestable: Harvestable) => {
      harvestable.sprite.setFrame(0)
    },
    droppedItems: ['Coconut'],
    onDestroyDrops: [
      {
        name: 'Wood',
        quantity: 5,
      },
      {
        name: 'Palm Frond',
        quantity: 3,
      },
    ],
    bodyResize: {
      width: 0.2,
      height: 0.1,
      offset: {
        y: 53,
      },
    },
  },
]

export const ALL_PARTICLES = [
  {
    name: 'Blood Particle',
    image: 'blood-particle',
    type: ItemTypes.particle,
    description: '',
  },
  {
    name: 'Wood Particle',
    image: 'wood-particle',
    type: ItemTypes.particle,
    description: '',
  },
]

export const ALL_MOBS = [
  {
    name: 'Monkey',
    animFrameName: 'monkey',
    animMapping: {
      walkFront: 'monkey-walk-front',
      walkSide: 'monkey-walk-side',
      walkBack: 'monkey-walk-back',
      idleFront: 'monkey-idle-front',
      idleSide: 'monkey-idle-side',
      idleBack: 'monkey-idle-back',
      dieFront: 'monkey-die-front',
      dieSide: 'monkey-die-side',
      dieBack: 'monkey-die-back',
      hurtFront: 'monkey-hurt-front',
      hurtSide: 'monkey-hurt-side',
      hurtBack: 'monkey-hurt-back',
      attackFront: 'monkey-attack-front',
      attackSide: 'monkey-attack-side',
      attackBack: 'monkey-attack-back',
    },
    animations: [
      {
        key: 'monkey-idle-front',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-idle-side',
        frames: {
          start: 8,
          end: 11,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-idle-back',
        frames: {
          start: 20,
          end: 23,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      // Walk animations
      {
        key: 'monkey-walk-front',
        frames: {
          start: 12,
          end: 15,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-walk-side',
        frames: {
          start: 4,
          end: 7,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-walk-back',
        frames: {
          start: 16,
          end: 19,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      // Hurt animations
      {
        key: 'monkey-hurt-front',
        frames: {
          start: 45,
          end: 47,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        key: 'monkey-hurt-side',
        frames: {
          start: 37,
          end: 37,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        key: 'monkey-hurt-back',
        frames: {
          start: 41,
          end: 41,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      // Death animations
      {
        key: 'monkey-die-front',
        frames: {
          start: 33,
          end: 36,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      {
        key: 'monkey-die-side',
        frames: {
          start: 37,
          end: 40,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      {
        key: 'monkey-die-back',
        frames: {
          start: 41,
          end: 44,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      // Attack animations
      {
        key: 'monkey-attack-front',
        frames: {
          start: 24,
          end: 26,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },

      {
        key: 'monkey-attack-side',
        frames: {
          start: 27,
          end: 29,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },
      {
        key: 'monkey-attack-back',
        frames: {
          start: 30,
          end: 32,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },
    ],
    health: 50,
    body: {
      width: 0.6,
      height: 0.5,
      offsetY: 15,
    },
    moveOffsets: {
      left: 8,
      right: 25,
    },
    aggroBehavior: 'Melee',
    drops: [],
    collidableLayers: ['Sand'],
    canSail: true,
    attackConfig: {
      attackDamage: 5,
      attackRange: 20,
      chaseSpeed: 50,
    },
  },
  {
    name: 'Crab',
    animFrameName: 'crab',
    animMapping: {
      walkFront: 'crab-walk-side',
      walkSide: 'crab-walk-front',
      walkBack: 'crab-walk-side',
      idleFront: 'crab-idle-side',
      idleSide: 'crab-idle-front',
      idleBack: 'crab-idle-side',
      dieFront: 'crab-die-side',
      dieSide: 'crab-die-front',
      dieBack: 'crab-die-side',
    },
    animations: [
      {
        type: AnimationType.IDLE_FRONT,
        key: 'crab-idle-front',
        frames: {
          start: 0,
          end: 2,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.WALK_FRONT,
        key: 'crab-walk-front',
        frames: {
          start: 4,
          end: 6,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.WALK_SIDE,
        key: 'crab-walk-side',
        frames: {
          start: 14,
          end: 16,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.IDLE_SIDE,
        key: 'crab-idle-side',
        frames: {
          start: 10,
          end: 12,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.HURT_FRONT,
        key: 'crab-hurt-front',
        frames: {
          start: 8,
          end: 8,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        type: AnimationType.DIE_FRONT,
        key: 'crab-die-front',
        frames: {
          start: 7,
          end: 9,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },
      {
        type: AnimationType.DIE_SIDE,
        key: 'crab-die-side',
        frames: {
          start: 16,
          end: 18,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },
    ],
    health: 20,
    drops: ['Crab claw'],
    collidableLayers: ['Grass', 'Ocean'],
  },
  {
    name: 'Skeleton',
    animFrameName: 'skeleton',
    animMapping: {
      walkFront: 'skeleton-walk-front',
      walkSide: 'skeleton-walk-side',
      walkBack: 'skeleton-walk-back',
      idleFront: 'skeleton-idle-front',
      idleSide: 'skeleton-idle-side',
      idleBack: 'skeleton-idle-back',
      dieFront: 'skeleton-die-front',
      dieSide: 'skeleton-die-front',
      dieBack: 'skeleton-die-front',
      hurtFront: 'skeleton-hurt-front',
      hurtSide: 'skeleton-hurt-side',
      hurtBack: 'skeleton-hurt-back',
      attackFront: 'skeleton-attack-front',
      attackSide: 'skeleton-attack-side',
      attackBack: 'skeleton-attack-back',
    },
    animations: [
      {
        key: 'skeleton-walk-side',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-side',
        frames: {
          start: 4,
          end: 4,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-idle-front',
        frames: {
          start: 5,
          end: 8,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-front',
        frames: {
          start: 9,
          end: 9,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-walk-front',
        frames: {
          start: 10,
          end: 13,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-back',
        frames: {
          start: 14,
          end: 14,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-walk-back',
        frames: {
          start: 15,
          end: 18,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-die-front',
        frames: {
          start: 19,
          end: 24,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 4,
      },
      {
        key: 'skeleton-idle-side',
        frames: {
          start: 25,
          end: 28,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-idle-back',
        frames: {
          start: 29,
          end: 32,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-side',
        frames: {
          start: 33,
          end: 36,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-front',
        frames: {
          start: 37,
          end: 40,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-back',
        frames: {
          start: 41,
          end: 44,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
    ],
    health: 150,
    body: {
      width: 0.25,
      height: 0.75,
      offsetY: 10,
      offsetX: 25,
    },
    moveOffsets: {
      left: 25,
      right: 40,
    },
    aggroBehavior: 'Melee',
    drops: [],
    collidableLayers: ['Ocean'],
    canSail: true,
    attackConfig: {
      attackDamage: 15,
      attackRange: 30,
      chaseSpeed: 65,
    },
  },
]

export const ALL_EFFECTS = [
  {
    scale: 3,
    ttl: 725,
    name: 'explosion-small',
    animation: {
      key: 'explosion-small-anim',
      frames: {
        start: 0,
        end: 8,
        suffix: '.png',
      },
      repeat: 0,
      frameRate: 15,
    },
  },
  {
    scale: 3,
    ttl: 725,
    name: 'cannon-flash',
    animation: {
      key: 'cannon-flash-anim',
      frames: {
        start: 0,
        end: 8,
        suffix: '.png',
      },
      repeat: 0,
      frameRate: 15,
    },
  },
]

export const ALL_ITEMS: ItemConfig[] = [
  {
    name: 'Row boat',
    inWorldImageSet: {
      side: 'rowboat',
      up: 'rowboat-up',
      down: 'rowboat-down',
    },
    inWorldImage: 'rowboat',
    image: 'rowboat-inventory',
    type: ItemTypes.transport,
    description: 'Explore the oceans!',
    recipe: {
      Stick: 1,
    },
  },
  {
    name: 'Tent',
    inWorldImage: 'tent',
    image: 'tent-inventory',
    type: ItemTypes.structure,
    description: "It's not much, but it's an honest home",
    recipe: {
      Wood: 5,
      'Palm Frond': 3,
    },
  },
  {
    name: 'Coconut',
    image: 'coconut',
    type: ItemTypes.resource,
    description: 'A tasty coconut',
  },
  {
    name: 'Palm Frond',
    image: 'palm-frond',
    type: ItemTypes.resource,
    description: 'Great for fanning',
  },
  {
    name: 'Wood',
    image: 'wood',
    type: ItemTypes.resource,
    description: 'Some woody wood',
    recipe: {
      Stick: 2,
    },
  },
  {
    name: 'Crab claw',
    image: 'crabclaw',
    stats: {
      dropLength: 300,
    },
    description: "These claws ain't just for attracting mates!",
    type: ItemTypes.resource,
  },
  {
    name: 'Rock',
    image: 'rock',
    description: 'Dwayne Johnson',
    type: ItemTypes.resource,
  },
  {
    name: 'Stick',
    image: 'stick',
    description: "What's brown and sticky?",
    type: ItemTypes.resource,
  },
  {
    name: 'Stone Axe',
    inWorldImage: 'axe',
    image: 'axe-inventory',
    description: 'And my axe!',
    recipe: {
      Rock: 2,
      Wood: 1,
    },
    stats: {
      damage: 15,
      'attack range': 20,
    },
    type: ItemTypes.weapon,
  },
]
