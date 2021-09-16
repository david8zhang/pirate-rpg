import Game from '../scenes/Game'
import { ALL_ITEMS } from '../utils/Constants'
import { Item } from './Item'

export class ItemFactory {
  public static instance: ItemFactory
  public scene: Game
  constructor(scene: Game) {
    this.scene = scene
    ItemFactory.instance = this
  }
  createItem(itemType: string, x: number, y: number): Item | null {
    const item = ALL_ITEMS.find((item) => item.name == itemType)
    if (item) {
      const itemGo = new Item(
        this.scene,
        x,
        y,
        item.image,
        item.stats && item.stats.dropLength ? item.stats.dropLength : 650
      )
      itemGo.itemName = item.name
      return itemGo
    }
    return null
  }

  changeItem(item: Item, itemType: string, x: number, y: number): void {
    const newItem = ALL_ITEMS.find((i) => i.name === itemType)
    try {
      if (newItem && item && item.sprite) {
        item.sprite.setTexture(newItem.image)
        item.dropLength = newItem.stats && newItem.stats.dropLength ? newItem.stats.dropLength : 650
        item.itemName = newItem.name
        item.sprite.x = x
        item.sprite.y = y
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Get whether the item is a weapon, armor, resource, etc.
  getItemType(itemName: string) {
    return ALL_ITEMS.find((i) => i.name == itemName)
  }
}
