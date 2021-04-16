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
      const itemGo = new Item(this.scene, x, y, item.image, item.dropLength ? item.dropLength : 650)
      itemGo.itemType = item.name
      return itemGo
    }
    return null
  }
}
