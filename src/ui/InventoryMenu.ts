import { Physics } from 'phaser'
import { Coconut } from '~/Items/Coconut'
import { Item } from '../Items/Item'

export class InventoryMenu {
  private scene: Phaser.Scene

  private itemBoxWidth = 20
  private menuStartX = 0
  private menuStartY = 0
  private items: any[] = []

  private container: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.items = [1, 2, 3, 4]
    this.container = scene.add.container(20, 20)
  }

  public addItems(item: Item) {
    this.items.push(item)
  }

  public display() {
    // Remove duplicates
    let index = 0
    this.items.forEach((item: Item) => {
      const xPos = index * this.itemBoxWidth + index * 8
      const panel = this.scene.add
        .nineslice(xPos, 0, this.itemBoxWidth + 5, this.itemBoxWidth + 5, 'panel', 5)
        .setOrigin(0.5)
      const sprite = this.scene.add.sprite(xPos, 0, 'coconut').setOrigin(0.5)
      this.container.add(panel)
      this.container.add(sprite)
      index++
    })
  }
}
