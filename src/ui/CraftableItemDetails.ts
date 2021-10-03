import { Inventory } from '~/characters/Player'
import { ALL_ITEMS } from '~/utils/Constants'
import { ItemConfig } from '../objects/ItemConfig'
import { button } from './components/Button'
import { itemStats } from './components/ItemStats'
import { text } from './components/Text'
import { CraftingMenu } from './CraftingMenu'
import { ItemBox } from './InventoryMenu'
import { TooltipPosition } from './ItemTooltip'

export class CraftableItemDetails {
  private sprite!: Phaser.GameObjects.Sprite
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private craftButton: Phaser.GameObjects.DOMElement | null = null
  private statList: Phaser.GameObjects.DOMElement[] = []
  private ingredientBoxes: ItemBox[] = []
  private playerInventory!: Inventory

  // DOM Elements
  private craftableItemName: Phaser.GameObjects.DOMElement | null = null
  private craftableItemDescription: Phaser.GameObjects.DOMElement | null = null
  private craftableItemNameElem: HTMLElement | null = null
  private craftableItemDescriptionElem: HTMLElement | null = null
  private itemCraftButtonElem: HTMLElement | null = null
  private craftingMenu: CraftingMenu
  public craftableItem!: ItemConfig

  public static MAX_ING_PER_RECIPE = 3

  public isVisible: boolean = false

  constructor(scene: Phaser.Scene, craftingMenu: CraftingMenu) {
    this.scene = scene
    this.craftingMenu = craftingMenu
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
    this.setVisible(true)
    this.craftableItem = craftableItem
    const xPos = itemToCraftDescription.x
    const yPos = itemToCraftDescription.y

    this.playerInventory = inventory

    this.sprite
      .setPosition(xPos + 15, yPos + 16)
      .setTexture(craftableItem.image)
      .setVisible(true)

    // // Add craftable item name
    if (!this.craftableItemNameElem) {
      this.craftableItemNameElem = text(craftableItem.name, {
        fontSize: '15px',
        fontFamily: 'GraphicPixel',
        color: 'white',
        margin: '0px',
        width: `${itemToCraftDescription.width - 15}px`,
      }) as HTMLElement
    } else {
      this.craftableItemNameElem.innerText = craftableItem.name
    }
    if (!this.craftableItemName) {
      this.craftableItemName = this.scene.add
        .dom(this.sprite.x + 12, yPos + 10, this.craftableItemNameElem)
        .setOrigin(0)
      this.container.add(this.craftableItemName)
    }

    // Add item description text
    if (!this.craftableItemDescriptionElem) {
      this.craftableItemDescriptionElem = text(craftableItem.description, {
        fontSize: '8px',
        fontFamily: 'GraphicPixel',
        color: 'white',
        width: `${itemToCraftDescription.width - 15}px`,
      }) as HTMLElement
    } else {
      this.craftableItemDescriptionElem.innerText = craftableItem.description
    }

    if (!this.craftableItemDescription) {
      this.craftableItemDescription = this.scene.add
        .dom(
          this.sprite.x - 5,
          yPos + this.craftableItemName.height + 15,
          this.craftableItemDescriptionElem
        )
        .setOrigin(0)
      this.container.add(this.craftableItemDescription)
    }

    // Add item crafting button
    if (!this.itemCraftButtonElem) {
      this.itemCraftButtonElem = button('Craft', {
        fontFamily: 'GraphicPixel',
        fontSize: '10px',
        width: itemToCraftDescription.width - 20,
        height: '20px',
      }) as HTMLElement
    }
    if (!this.craftButton) {
      this.craftButton = this.scene.add
        .dom(this.sprite.x - 5, yPos + itemToCraftDescription.height - 30, this.itemCraftButtonElem)
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

      // If the item is no longer craftable, get rid of highlight and show blank crafting details page
      if (!this.isItemCraftable(this.craftableItem, inventory)) {
        this.craftingMenu.currentCraftableItem = null
        this.craftingMenu.currHighlight.setVisible(false)
        this.setVisible(false)
      }
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
    let yPos = this.craftableItemDescription!.y + this.craftableItemDescription!.height + 20
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
    const recipe = craftableItem.recipe
    if (!recipe) return
    let currXPos = xPos

    if (this.ingredientBoxes.length === 0) {
      for (let i = 0; i < CraftableItemDetails.MAX_ING_PER_RECIPE; i++) {
        const itemToBeCrafted = new ItemBox(this.scene, currXPos, yPos)
        itemToBeCrafted.tooltipPosition = TooltipPosition.TOP_MID
        itemToBeCrafted.setVisible(this.isVisible)
        this.ingredientBoxes.push(itemToBeCrafted)
        currXPos += itemToBeCrafted.panel.width + 5
      }
    }

    const ingredients = Object.keys(recipe)
    this.ingredientBoxes.forEach((ingBox, index) => {
      const ingredientName = ingredients[index]
      const ing = this.getIngredientForName(ingredientName)
      if (!ingredientName) {
        ingBox.setVisible(false)
      }
      if (ing) {
        if (index < ingredients.length) {
          const playerHasEnough =
            this.playerInventory[ing.name] &&
            this.playerInventory[ing.name].count >= recipe[ingredientName]
          ingBox.setTextColor(playerHasEnough ? 'white' : 'red')
          ingBox.setItem(recipe[ingredientName], ingredientName, ing.image)
          ingBox.setVisible(this.isVisible)
        }
      }
    })

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
    this.statList.forEach((stat) => {
      stat.setVisible(isVisible)
    })
    if (this.craftableItem) {
      const { recipe } = this.craftableItem
      const numBoxes = Object.keys(recipe).length
      for (let i = 0; i < numBoxes; i++) {
        this.ingredientBoxes[i].setVisible(isVisible)
      }
    }
  }
}
