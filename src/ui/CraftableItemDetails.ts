import { Inventory } from '~/characters/Player'
import { ALL_ITEMS } from '~/utils/Constants'
import { ItemConfig } from '../items/ItemConfig'
import { button } from './components/Button'
import { itemStats } from './components/ItemStats'
import { text } from './components/Text'
import { ItemBox } from './InventoryMenu'
import { TooltipPosition } from './ItemTooltip'

export class CraftableItemDetails {
  private sprite!: Phaser.GameObjects.Sprite
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private craftableItemName: Phaser.GameObjects.DOMElement | null = null
  private craftableItemDescription: Phaser.GameObjects.DOMElement | null = null
  private craftButton: Phaser.GameObjects.DOMElement | null = null
  private statList: Phaser.GameObjects.DOMElement[] = []
  private ingredientBoxes: ItemBox[] = []
  private playerInventory!: Inventory

  public craftableItem!: ItemConfig

  public isVisible: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)
    this.sprite = this.scene.add.sprite(0, 0, '').setVisible(false)
    this.container.setVisible(false)
    this.container.add(this.sprite)
  }

  showItem(
    craftableItem: ItemConfig,
    itemToCraftDescription: Phaser.GameObjects.Rectangle,
    inventory: Inventory,
    cb: Function
  ) {
    this.craftableItem = craftableItem
    const xPos = itemToCraftDescription.x
    const yPos = itemToCraftDescription.y

    this.playerInventory = inventory

    this.sprite
      .setPosition(xPos + 15, yPos + 16)
      .setTexture(craftableItem.image)
      .setVisible(true)

    // Add craftable item name
    const craftableItemName = text(craftableItem.name, {
      fontSize: '15px',
      fontFamily: 'GraphicPixel',
      color: 'white',
      margin: '0px',
      width: `${itemToCraftDescription.width - 15}px`,
    }) as HTMLElement

    if (this.craftableItemName) {
      this.craftableItemName.setElement(craftableItemName)
    } else {
      this.craftableItemName = this.scene.add
        .dom(this.sprite.x + 12, yPos + 10, craftableItemName)
        .setOrigin(0)
      this.container.add(this.craftableItemName)
    }

    // Add item description text
    const itemDescriptionText = text(craftableItem.description, {
      fontSize: '8px',
      fontFamily: 'GraphicPixel',
      color: 'white',
      width: `${itemToCraftDescription.width - 15}px`,
    }) as HTMLElement
    if (this.craftableItemDescription) {
      this.craftableItemDescription.setElement(itemDescriptionText)
    } else {
      this.craftableItemDescription = this.scene.add
        .dom(this.sprite.x - 5, yPos + this.craftableItemName.height + 15, itemDescriptionText)
        .setOrigin(0)
      this.container.add(this.craftableItemDescription)
    }

    // Add item crafting button
    const itemCraftButton = button('Craft', {
      fontFamily: 'GraphicPixel',
      fontSize: '10px',
      width: itemToCraftDescription.width - 20,
      height: '20px',
    }) as HTMLElement
    if (!this.craftButton) {
      this.craftButton = this.scene.add
        .dom(this.sprite.x - 5, yPos + itemToCraftDescription.height - 30, itemCraftButton)
        .addListener('click')
        .on('click', () => {
          this.onCraftButtonClick(inventory, cb)
        })
        .setOrigin(0)
      this.container.add(this.craftButton)
    }
    this.setIngredientsRequired(craftableItem, this.craftButton.x - 10, this.craftButton.y - 50)

    // Add item stats
    this.addItemStats(craftableItem)
    this.container.setVisible(this.isVisible)
  }

  onCraftButtonClick(inventory: Inventory, cb: Function) {
    if (this.isItemCraftable(this.craftableItem, inventory)) {
      cb(this.craftableItem)
    }
  }

  isItemCraftable(craftableItem: ItemConfig, inventory: Inventory) {
    const recipe = craftableItem.recipe
    if (!recipe) return
    const ingredients = Object.keys(recipe)
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i]
      if (!inventory[ing] || inventory[ing].count < recipe[ing]) {
        return false
      }
    }
    return true
  }

  addItemStats(craftableItem: ItemConfig) {
    let stats = craftableItem.stats || {}

    // Reset the stat list
    this.statList.forEach((stat: Phaser.GameObjects.DOMElement) => {
      stat.destroy()
    })
    this.statList = []

    // Populate the new statlist
    let yPos = this.craftableItemDescription!.y + this.craftableItemDescription!.height + 10
    Object.keys(stats).forEach((stat: string, index: number) => {
      const statElement = itemStats(stat, craftableItem.stats![stat]) as HTMLElement
      if (this.statList[index]) {
        this.statList[index].setElement(statElement)
      } else {
        const stat = this.scene.add.dom(this.sprite.x - 5, yPos, statElement).setOrigin(0)
        this.container.add(stat)
        this.statList[index] = stat
      }
      yPos += 10
    })
  }

  getIngredientForName(name: string) {
    return ALL_ITEMS.find((item) => item.name === name)
  }

  setIngredientsRequired(craftableItem: ItemConfig, xPos: number, yPos: number) {
    this.ingredientBoxes.forEach((ingBox: ItemBox) => {
      ingBox.destroy()
    })
    this.ingredientBoxes = []
    const recipe = craftableItem.recipe
    if (!recipe) return
    let currXPos = xPos
    Object.keys(recipe).forEach((ingredient, index: number) => {
      const ing = this.getIngredientForName(ingredient)
      if (ing) {
        let itemToBeCrafted = this.ingredientBoxes[index]
        const playerHasEnough =
          this.playerInventory[ing.name] &&
          this.playerInventory[ing.name].count >= recipe[ingredient]
        if (!this.ingredientBoxes[index]) {
          itemToBeCrafted = new ItemBox(this.scene, currXPos, yPos)
          itemToBeCrafted.tooltipPosition = TooltipPosition.TOP_MID
          itemToBeCrafted.setVisible(this.isVisible)
          this.ingredientBoxes.push(itemToBeCrafted)
        }
        itemToBeCrafted.setTextColor(playerHasEnough ? 'white' : 'red')
        itemToBeCrafted.setItem(recipe[ingredient], ingredient, ing.image)
        currXPos += itemToBeCrafted.panel.width + 5
      }
    })
  }

  setVisible(isVisible: boolean) {
    this.isVisible = isVisible
    this.container.setVisible(isVisible)
    this.ingredientBoxes.forEach((itemBox: ItemBox) => {
      itemBox.setVisible(isVisible)
    })
    this.statList.forEach((stat) => {
      stat.setVisible(isVisible)
    })
  }
}