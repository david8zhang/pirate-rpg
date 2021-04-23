import { ItemTypes } from '../items/ItemConfig'

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
}

export const ALL_ITEMS = [
  {
    name: 'Coconut',
    image: 'coconut',
    type: ItemTypes.resource,
    description: 'A tasty coconut',
  },
  {
    name: 'Crab claw',
    image: 'crabclaw',
    recipe: {
      Stick: 1,
    },
    stats: {
      dropLength: 300,
      damage: 15,
      'attack range': 20,
    },
    description: "These claws ain't just for attracting mates!",
    type: ItemTypes.weapon,
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
    image: 'axe',
    thumbnail: 'axe-inventory',
    description: 'And my axe!',
    recipe: {
      Rock: 2,
      Stick: 1,
    },
    stats: {
      damage: 15,
      'attack range': 20,
    },
    type: ItemTypes.weapon,
  },
]
