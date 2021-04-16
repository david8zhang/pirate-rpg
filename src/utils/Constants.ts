import { CraftableItemTypes } from '../items/CraftableItem'

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

export const ALL_CRAFTABLE_ITEMS = [
  {
    name: 'Stone Axe',
    image: 'axe',
    description: "It's an axe made of stone. Perfect for tree murder",
    recipe: {
      Rock: 2,
      Stick: 1,
    },
    stats: {
      damage: 15,
    },
    type: CraftableItemTypes.weapon,
  },
]

export const ALL_ITEMS = [
  {
    name: 'Coconut',
    image: 'coconut',
  },
  {
    name: 'Crab claw',
    image: 'crabclaw',
    dropLength: 300,
  },
  {
    name: 'Rock',
    image: 'rock',
  },
  {
    name: 'Stick',
    image: 'stick',
  },
  {
    name: 'Stone Axe',
    image: 'axe',
  },
]
