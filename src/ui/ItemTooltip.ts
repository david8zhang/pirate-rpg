import { ItemFactory } from '~/objects/ItemFactory'
import { Constants } from '~/utils/Constants'

export enum TooltipPosition {
  TOP_RIGHT = 'topRight',
  TOP_LEFT = 'topLeft',
  TOP_MID = 'topMid',
  BOTTOM_RIGHT = 'bottomRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_MID = 'bottomMid',
}

export class ItemTooltip {
  private width = 125
  private height = 20
  private container: Phaser.GameObjects.Container
  private itemNameText: Phaser.GameObjects.Text
  private itemDescriptionText: Phaser.GameObjects.Text
  private scene: Phaser.Scene
  private rectangle: Phaser.GameObjects.Rectangle
  public itemName!: string
  public position: TooltipPosition = TooltipPosition.BOTTOM_RIGHT

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.container = scene.add.container(x, y)
    this.scene = scene
    this.rectangle = scene.add
      .rectangle(x - 5, y - 5, this.width, 50, 0x000000, 0.5)
      .setOrigin(0, 0)
    this.itemNameText = scene.add
      .text(x, y, '', {
        fontSize: '12px',
        align: 'left',
        fontFamily: 'GraphicPixel',
        color: 'white',
      })
      .setOrigin(0, 0)

    this.itemDescriptionText = scene.add
      .text(x, y + this.itemNameText.height + 5, '', {
        fontSize: '10px',
        align: 'left',
        fontFamily: 'GraphicPixel',
        color: 'white',
      })
      .setOrigin(0, 0)
    this.container.add(this.rectangle)
    this.container.add(this.itemNameText)
    this.container.add(this.itemDescriptionText)
    this.container.setDepth(2000)
    this.container.setVisible(false)
  }

  update() {
    if (this.itemName) {
      this.showItemTooltip(this.itemName, this.scene.input.x, this.scene.input.y)
    } else {
      this.hide()
    }
  }

  showItemTooltip(itemName: string, x: number, y: number) {
    const itemConfig = ItemFactory.instance.getItemType(itemName)
    if (itemConfig) {
      this.setContainerPosition(x, y)
      this.itemNameText.text = `${itemName}`
      this.itemDescriptionText.text = itemConfig.description
    }
    this.rectangle.height = this.itemDescriptionText.height + this.itemNameText.height + 20

    this.itemDescriptionText.setStyle({
      wordWrap: { width: this.width, useAdvancedWrap: true },
    })
    this.container.setVisible(true)
  }

  setContainerPosition(x: number, y: number) {
    switch (this.position) {
      case TooltipPosition.TOP_LEFT: {
        this.container.setX(x - this.rectangle.width - 10)
        this.container.setY(y - this.rectangle.height - 0)
        break
      }
      case TooltipPosition.TOP_MID: {
        this.container.setX(x - this.rectangle.width / 2)
        this.container.setY(y - this.rectangle.height - 0)
        break
      }
      case TooltipPosition.TOP_RIGHT: {
        this.container.setX(x + 10)
        this.container.setY(y - this.rectangle.height - 0)
        break
      }
      case TooltipPosition.BOTTOM_LEFT: {
        this.container.setX(x - this.rectangle.width - 10)
        this.container.setY(y + 10)
        break
      }
      case TooltipPosition.BOTTOM_MID: {
        this.container.setX(x - this.rectangle.width / 2)
        this.container.setY(y + 10)
        break
      }
      case TooltipPosition.BOTTOM_RIGHT: {
        this.container.setX(x + 10)
        this.container.setY(y + 10)
        break
      }
    }
  }

  hide() {
    this.container.setVisible(false)
  }
}
