import { Item } from '../items/Item'

export class ItemTooltip {
  private width = 125
  private height = 20
  private container: Phaser.GameObjects.Container
  private itemNameText: Phaser.GameObjects.Text
  private itemDescriptionText: Phaser.GameObjects.Text
  private scene: Phaser.Scene
  private rectangle: Phaser.GameObjects.Rectangle
  public itemType!: string

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
    this.container.setVisible(false)
  }

  update() {
    if (this.itemType) {
      this.showItemTooltip(this.itemType, this.scene.input.x, this.scene.input.y)
    } else {
      this.hide()
    }
  }

  showItemTooltip(itemType: string, x: number, y: number) {
    this.container.setX(x + 10)
    this.container.setY(y + 10)
    this.itemNameText.text = `${itemType}`
    this.itemDescriptionText.text = 'Lorem ipsum dolor sit amet'

    this.rectangle.height = this.itemDescriptionText.height + this.itemNameText.height + 20

    this.itemDescriptionText.setStyle({
      wordWrap: { width: this.width, useAdvancedWrap: true },
    })

    this.container.setVisible(true)
  }

  hide() {
    this.container.setVisible(false)
  }
}
