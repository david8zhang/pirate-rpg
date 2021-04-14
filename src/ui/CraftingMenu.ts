import { Inventory } from '~/characters/Player'
import { CraftableItem } from '~/items/CraftableItem'
import { ALL_CRAFTABLE_ITEMS } from '../utils/Constants'
import { CraftableItemDetails } from './CraftableItemDetails'

export class CraftingMenu {
  private static X_POS: number = 350
  private static Y_POS: number = 10
  private static WIDTH: number = 250
  private static HEIGHT: number = 300

  // Phaser Scene
  public scene: Phaser.Scene
  public isVisible = false

  // UI components
  private rectangle: Phaser.GameObjects.Rectangle
  private craftableItemsListWrapper: Phaser.GameObjects.Rectangle
  public itemToCraftDescription: Phaser.GameObjects.Rectangle
  public craftableItemsList: Phaser.GameObjects.Text[] = []
  public currHighlight: Phaser.GameObjects.Rectangle
  private container: Phaser.GameObjects.Container
  private headerText!: Phaser.GameObjects.Text
  private craftableItemDetails: CraftableItemDetails

  // Game state variables
  public currentCraftableItem: CraftableItem | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.rectangle = scene.add
      .rectangle(
        CraftingMenu.X_POS - 5,
        CraftingMenu.Y_POS - 5,
        CraftingMenu.WIDTH,
        CraftingMenu.HEIGHT,
        0x795644,
        1
      )
      .setOrigin(0, 0)

    this.craftableItemsListWrapper = scene.add
      .rectangle(
        CraftingMenu.X_POS,
        CraftingMenu.Y_POS + 20 + 5,
        CraftingMenu.WIDTH / 2.5,
        CraftingMenu.HEIGHT - 20 - 15,
        0x000000,
        0.5
      )
      .setOrigin(0, 0)

    this.itemToCraftDescription = scene.add
      .rectangle(
        CraftingMenu.X_POS + this.craftableItemsListWrapper.width + 5,
        CraftingMenu.Y_POS + 20 + 5,
        CraftingMenu.WIDTH - CraftingMenu.WIDTH / 2.5 - 15,
        CraftingMenu.HEIGHT - 20 - 15,
        0x000000,
        0.5
      )
      .setOrigin(0, 0)

    this.currHighlight = scene.add
      .rectangle(0, 0, this.craftableItemsListWrapper.width, 15, 0xffff00, 0.5)
      .setOrigin(0, 0)
      .setVisible(false)

    this.container = scene.add.container(0, 0)
    this.container.add(this.rectangle)
    this.container.add(this.craftableItemsListWrapper)
    this.container.add(this.itemToCraftDescription)
    this.container.add(this.currHighlight)
    this.container.setVisible(this.isVisible)
    this.craftableItemDetails = new CraftableItemDetails(this.scene)
  }

  public toggleVisible() {
    if (!this.headerText) {
      this.headerText = this.scene.add
        .text(CraftingMenu.X_POS + CraftingMenu.WIDTH / 2, CraftingMenu.Y_POS + 10, 'Crafting', {
          fontFamily: 'GraphicPixel',
          fontSize: '20px',
        })
        .setOrigin(0.5)
      this.container.add(this.headerText)
    }
    this.container.setVisible(!this.isVisible)
    this.isVisible = !this.isVisible
  }

  getCraftableBasedOnInventory(inventory: Inventory): CraftableItem[] {
    const craftableItems: CraftableItem[] = []
    ALL_CRAFTABLE_ITEMS.forEach((item) => {
      const recipe = item.recipe
      const keys = Object.keys(recipe)
      let isCraftable = true
      for (let i = 0; i < keys.length; i++) {
        const currKey = keys[i]
        if (!inventory[currKey] || inventory[currKey].count < recipe[currKey]) {
          isCraftable = false
          break
        }
      }
      if (isCraftable) {
        craftableItems.push(item)
      }
    })
    return craftableItems
  }

  updateCraftableItems(inventory: Inventory) {
    const craftableItems = this.getCraftableBasedOnInventory(inventory)

    const startingX = this.craftableItemsListWrapper.x + 5
    let yPos = this.craftableItemsListWrapper.y + 5
    const listCutoffPoint =
      this.craftableItemsListWrapper.height + this.craftableItemsListWrapper.y - 5

    craftableItems.forEach((item: CraftableItem, index: number) => {
      let text = this.craftableItemsList[index]
      if (yPos < listCutoffPoint) {
        if (!text) {
          text = this.scene.add.text(startingX, yPos, item.name, {
            fontFamily: 'GraphicPixel',
            fontSize: '10px',
          })
          this.craftableItemsList.push(text)
          this.container.add(text)
        } else {
          text.setText(item.name)
        }
        yPos += text.height + 5
        text.setInteractive()
        text.on('pointerdown', (obj) => {
          this.currHighlight.setX(text.x - 5)
          this.currHighlight.setY(text.y - 2)
          this.currHighlight.setVisible(true)
          this.currentCraftableItem = item
          this.craftableItemDetails.showItem(item, this.itemToCraftDescription)
        })
      }
    })
  }
}
