import { Harvestable } from '../objects/Harvestable'
import { ItemTypes } from '../objects/ItemConfig'

export class Constants {
  static get TILE_SIZE() {
    return 16
  }
  static get BG_HEIGHT() {
    return 150 * Constants.TILE_SIZE
  }
  static get BG_WIDTH() {
    return 150 * Constants.TILE_SIZE
  }
  static get ATTACK_DURATION() {
    return 400
  }
  static get WEAPON_SWING_DURATION() {
    return 300
  }
}

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

export const ALL_ITEMS = [
  {
    name: 'Tent',
    structureImage: 'tent',
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
    weaponImage: 'axe',
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
