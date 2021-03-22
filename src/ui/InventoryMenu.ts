import { Physics } from 'phaser'
import Player, { Inventory } from '~/characters/Player'
import { Coconut } from '~/Items/Coconut'
import { Item } from '../Items/Item'

class ItemBox {
  // Dimensions
  public static WIDTH = 22
  public static HEIGHT = 22
  public static PADDING_WITHIN_BOX = 10

  // Item contained inside
  private sprite!: Phaser.GameObjects.Sprite
  public itemType!: String
  public countText: Phaser.GameObjects.Text

  // instance vars
  private scene: Phaser.Scene
  public y: number
  public x: number
  private container: Phaser.GameObjects.Container

  constructor(
    scene: Phaser.Scene,
    container: Phaser.GameObjects.Container,
    xPos: number,
    yPos: number
  ) {
    this.scene = scene
    this.x = xPos
    this.y = yPos
    const panel = scene.add
      .nineslice(
        xPos,
        yPos,
        ItemBox.WIDTH + ItemBox.PADDING_WITHIN_BOX,
        ItemBox.HEIGHT + ItemBox.PADDING_WITHIN_BOX,
        'panel',
        5
      )
      .setOrigin(0.5)
    panel.tint = 0xaaaaaa
    panel.setAlpha(0.9)
    this.sprite = scene.add.sprite(xPos, yPos, '')
    this.sprite.setVisible(false)
    this.countText = scene.add
      .text(xPos + 8, yPos + 8, '', {
        fontSize: '10px',
        padding: {
          left: 20,
        },
        align: 'right',
        fontFamily: 'GraphicPixel',
        color: 'white',
      })
      .setOrigin(0.5)
    this.countText.autoRound = false
    this.container = container
    this.container.add(panel)
    this.container.add(this.sprite)
    this.container.add(this.countText)
  }

  setItem(count: number, itemType: string, texture: string) {
    this.itemType = itemType
    this.sprite.setTexture(texture)
    if (count > 0) {
      this.sprite.setVisible(true)
    }
    this.countText.setText(count.toString())
  }
}

export class InventoryMenu {
  private scene: Phaser.Scene
  private isExpanded: boolean = false
  private numRows: number = 1
  private numCols: number = 5

  private container: Phaser.GameObjects.Container
  private itemBoxes: ItemBox[][] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.container = scene.add.container(25, 25)
  }

  public initialize() {
    const paddingBetweenBox = 12
    for (let i = 0; i < this.numRows; i++) {
      const yPos = i * (ItemBox.WIDTH + paddingBetweenBox)
      this.itemBoxes[i] = new Array(this.numCols)
      for (let j = 0; j < this.numCols; j++) {
        const xPos = j * (ItemBox.WIDTH + paddingBetweenBox)
        this.itemBoxes[i][j] = new ItemBox(this.scene, this.container, xPos, yPos)
      }
    }
  }

  public updateInventoryMenu(inventory: Inventory) {
    let inventoryIndex = 0
    const inventoryTypes = Object.keys(inventory)
    for (let i = 0; i < this.itemBoxes.length; i++) {
      for (let j = 0; j < this.itemBoxes[0].length; j++) {
        const itemType = inventoryTypes[inventoryIndex]
        if (itemType) {
          const { count, texture } = inventory[itemType]
          this.itemBoxes[i][j].setItem(count, itemType, texture)
          inventoryIndex++
        }
      }
    }
  }
}
