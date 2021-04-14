import { CraftableItem } from '../items/CraftableItem'
export class CraftableItemDetails {
  private sprite!: Phaser.GameObjects.Sprite
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private craftableItemName: Phaser.GameObjects.Text
  private craftableItemDescription: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)
    this.sprite = this.scene.add.sprite(0, 0, '')
    this.craftableItemName = this.scene.add.text(0, 0, '')
    this.craftableItemDescription = this.scene.add.text(0, 0, '')
    this.container.add(this.sprite)
    this.container.add(this.craftableItemName)
    this.container.add(this.craftableItemDescription)
    this.container.setVisible(false)
  }

  showItem(craftableItem: CraftableItem, itemToCraftDescription: Phaser.GameObjects.Rectangle) {
    const xPos = itemToCraftDescription.x
    const yPos = itemToCraftDescription.y

    this.sprite.setPosition(xPos + 15, yPos + 12).setTexture(craftableItem.image)
    this.craftableItemName
      .setPosition(this.sprite.x + 12, yPos + 10)
      .setText(craftableItem.name)
      .setStyle({
        fontFamily: 'GraphicPixel',
        fontSize: '12px',
        resolution: 2,
        wordWrap: {
          width: itemToCraftDescription.width - (this.sprite.width + 10),
        },
      })

    this.craftableItemDescription
      .setText(craftableItem.description)
      .setPosition(this.sprite.x - 5, yPos + this.craftableItemName.height + 20)
      .setStyle({
        fontFamily: 'GraphicPixel',
        fontSize: '10px',
        wordWrap: {
          width: itemToCraftDescription.width - 15,
        },
      })
    console.log(this.craftableItemDescription)
    this.container.setVisible(true)
  }
}
