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

export const ALL_SHIPS = [
  {
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
      ],
      up: [],
      down: [],
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
      right: [],
      up: [],
      down: [],
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
        frameRate: 5,
      },

      {
        key: 'monkey-attack-side',
        frames: {
          start: 27,
          end: 29,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 5,
      },
      {
        key: 'monkey-attack-back',
        frames: {
          start: 30,
          end: 32,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 5,
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
    collidableLayers: ['Sand', 'Ocean'],
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
