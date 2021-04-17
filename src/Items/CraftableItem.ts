export enum CraftableItemTypes {
  weapon = 'WEAPON',
  armor = 'ARMOR',
}

export interface CraftableItem {
  name: string
  image: string
  description: string
  recipe: {
    [itemType: string]: number
  }
  type: CraftableItemTypes
  stats: {
    [stat: string]: number
  }
}
