import { CraftableItem } from '../items/CraftableItem'
import { button } from './components/Button'
import { text } from './components/Text'
export class CraftableItemDetails {
  private sprite!: Phaser.GameObjects.Sprite
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private craftableItemName: Phaser.GameObjects.Text
  private craftableItemDescription: Phaser.GameObjects.DOMElement | null = null
  private craftButton: Phaser.GameObjects.DOMElement | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)
    this.sprite = this.scene.add.sprite(0, 0, '').setVisible(false)
    this.craftableItemName = this.scene.add.text(0, 0, '')
    this.container.add(this.sprite)
    this.container.add(this.craftableItemName)
    this.container.setVisible(false)
  }

  showItem(craftableItem: CraftableItem, itemToCraftDescription: Phaser.GameObjects.Rectangle) {
    const xPos = itemToCraftDescription.x
    const yPos = itemToCraftDescription.y

    this.sprite
      .setPosition(xPos + 15, yPos + 12)
      .setTexture(craftableItem.image)
      .setVisible(true)
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

    // Add item description text
    const itemDescriptionText = text(craftableItem.description, {
      fontSize: '8px',
      fontFamily: 'GraphicPixel',
      color: 'white',
      width: `${itemToCraftDescription.width - 15}px`,
    }) as HTMLElement
    if (this.craftableItemDescription) {
      this.craftableItemDescription.destroy()
    }
    this.craftableItemDescription = this.scene.add
      .dom(this.sprite.x - 5, yPos + this.craftableItemName.height + 10, itemDescriptionText)
      .setOrigin(0)
    this.container.add(this.craftableItemDescription)

    // Add item crafting button
    const itemCraftButton = button('Craft', {
      fontFamily: 'GraphicPixel',
      fontSize: '10px',
      width: itemToCraftDescription.width - 20,
      height: '20px',
    }) as HTMLElement
    if (this.craftButton) {
      this.craftButton.destroy()
    }
    this.craftButton = this.scene.add
      .dom(this.sprite.x - 5, yPos + itemToCraftDescription.height - 30, itemCraftButton)
      .addListener('click')
      .on('click', () => {
        console.log('Clicked!')
      })
      .setOrigin(0)
    this.container.add(this.craftButton)

    this.container.setVisible(true)
  }

  setVisible(isVisible: boolean) {
    this.container.setVisible(isVisible)
  }
}
