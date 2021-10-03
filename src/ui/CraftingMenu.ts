import { Inventory } from '~/characters/Player'
import { ItemConfig } from '~/objects/ItemConfig'
import Game from '~/scenes/Game'
import { ALL_ITEMS } from '../utils/Constants'
import { button } from './components/Button'
import { text } from './components/Text'
import { CraftableItemDetails } from './CraftableItemDetails'

export class CraftingMenu {
  private static X_POS: number = 350
  private static Y_POS: number = 10
  private static WIDTH: number = 250
  private static HEIGHT: number = 250

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
  private headerText!: Phaser.GameObjects.DOMElement
  private pageDownButton!: Phaser.GameObjects.DOMElement
  private pageUpButton!: Phaser.GameObjects.DOMElement
  private craftableItemDetails: CraftableItemDetails

  // Game state variables
  public currentCraftableItem: {
    item: ItemConfig
    page: number
  } | null = null
  public onCraft: Function | null = null
  private currPage: number = 0

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

    const pageDownBtnElem = button('Next >', {
      fontFamily: 'GraphicPixel',
      fontSize: '5px',
      width: this.craftableItemsListWrapper.width / 2 - 5,
      height: '10px',
    })
    this.pageDownButton = this.scene.add
      .dom(
        this.craftableItemsListWrapper.x + this.craftableItemsListWrapper.width / 2 + 20,
        this.craftableItemsListWrapper.y + this.craftableItemsListWrapper.height - 10,
        pageDownBtnElem
      )
      .setVisible(true)
      .setDepth(1000)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.currPage += 1
        const craftableItemPages = this.createCraftableItemPages(this.getCraftableItems())
        this.currPage = Math.min(
          craftableItemPages.length > 0 ? craftableItemPages.length - 1 : 0,
          this.currPage
        )
        this.updateCraftableItems(Game.instance.player.inventory)
        if (!this.currentCraftableItem || this.currentCraftableItem.page !== this.currPage) {
          this.currHighlight.setVisible(false)
        } else {
          this.currHighlight.setVisible(true)
        }
      })

    const pageUpButtonElem = button('< Prev', {
      fontFamily: 'GraphicPixel',
      fontSize: '5px',
      width: this.craftableItemsListWrapper.width / 2 - 5,
      height: '10px',
    })
    this.pageUpButton = this.scene.add
      .dom(
        this.craftableItemsListWrapper.x + 25,
        this.craftableItemsListWrapper.y + this.craftableItemsListWrapper.height - 10,
        pageUpButtonElem
      )
      .setDepth(1000)
      .setOrigin(0.5)
      .addListener('click')
      .on('click', () => {
        this.currPage -= 1
        this.currPage = Math.max(0, this.currPage)
        this.updateCraftableItems(Game.instance.player.inventory)
        if (!this.currentCraftableItem || this.currentCraftableItem.page !== this.currPage) {
          this.currHighlight.setVisible(false)
        } else {
          this.currHighlight.setVisible(true)
        }
      })

    this.container = scene.add.container(0, 0)
    this.container.add(this.pageDownButton)
    this.container.add(this.pageUpButton)
    this.container.add(this.rectangle)
    this.container.add(this.craftableItemsListWrapper)
    this.container.add(this.itemToCraftDescription)
    this.container.add(this.currHighlight)
    this.container.setVisible(this.isVisible)
    this.craftableItemDetails = new CraftableItemDetails(this.scene, this)
  }

  setOnCraftCallback(cb: Function) {
    this.onCraft = cb
  }

  public toggleVisible() {
    if (this.isVisible) {
      this.currentCraftableItem = null
      this.craftableItemDetails.setVisible(false)
      this.currHighlight.setVisible(false)
    }

    if (!this.headerText) {
      const headerTextComp = text('Crafting', {
        fontSize: '15px',
        margin: '0px',
        fontFamily: 'GraphicPixel',
        color: 'white',
      }) as HTMLElement
      this.headerText = this.scene.add
        .dom(CraftingMenu.X_POS + CraftingMenu.WIDTH / 2, CraftingMenu.Y_POS + 10, headerTextComp)
        .setOrigin(0.5)
      this.container.add(this.headerText)
    }
    this.container.setVisible(!this.isVisible)
    this.isVisible = !this.isVisible
  }

  createCraftableItemPages(craftableItems: any[]) {
    let yPos = this.craftableItemsListWrapper.y + 5
    const listCutoffPoint =
      this.craftableItemsListWrapper.height + this.craftableItemsListWrapper.y - 5
    const pages: any[][] = []
    let currPage: any[] = []
    craftableItems.forEach((c: ItemConfig) => {
      if (yPos < listCutoffPoint && c.recipe) {
        currPage.push(c)
      } else {
        pages.push(currPage)
        currPage = []
        yPos = this.craftableItemsListWrapper.y + 5
      }
      yPos += 16
    })
    if (currPage.length > 0) {
      pages.push(currPage)
    }
    return pages
  }

  getPageSize() {
    const yPos = this.craftableItemsListWrapper.y + 5
    const listCutoffPoint =
      this.craftableItemsListWrapper.height + this.craftableItemsListWrapper.y - 5
    return Math.round((listCutoffPoint - yPos) / 16) - 1
  }

  fulfillsRecipe(inventory: Inventory, recipe: any, name: string) {
    if (!inventory || Object.keys(inventory).length === 0) {
      return false
    }
    const reqIngredients = Object.keys(recipe)
    for (let i = 0; i < reqIngredients.length; i++) {
      const ing = reqIngredients[i]
      if (!inventory[ing] || inventory[ing].count < recipe[ing]) {
        return false
      }
    }
    return true
  }

  getCraftableItems() {
    const craftableItems = ALL_ITEMS.filter((item) => {
      return (
        item.recipe !== undefined &&
        this.fulfillsRecipe(Game.instance.player.inventory, item.recipe, item.name)
      )
    })
    return craftableItems
  }

  updateCraftableItems(inventory: Inventory) {
    const startingX = this.craftableItemsListWrapper.x + 5
    let yPos = this.craftableItemsListWrapper.y + 5

    const craftableItems = ALL_ITEMS.filter((item) => {
      return (
        item.recipe !== undefined &&
        this.fulfillsRecipe(Game.instance.player.inventory, item.recipe, item.name)
      )
    })
    const craftableItemPages = this.createCraftableItemPages(craftableItems)
    const currPage = craftableItemPages.length > 0 ? craftableItemPages[this.currPage] : []
    const pageSize = this.getPageSize()
    for (let i = 0; i < pageSize; i++) {
      let text = this.craftableItemsList[i]
      const item = currPage[i]
      if (!text) {
        text = this.scene.add.text(startingX, yPos, '', {
          fontFamily: 'GraphicPixel',
          fontSize: '10px',
        })
        this.craftableItemsList.push(text)
        this.container.add(text)
      }
      if (item) {
        text.setText(item.name)
        text.setInteractive()
        text.on('pointerdown', () => {
          this.currHighlight.setX(text.x - 5)
          this.currHighlight.setY(text.y - 2)
          this.currHighlight.setVisible(true)
          this.currentCraftableItem = {
            item,
            page: this.currPage,
          }
          this.craftableItemDetails.showItem(
            item,
            this.itemToCraftDescription,
            inventory,
            this.onCraft as Function
          )
        })
        text.setVisible(true)
      } else {
        text.setVisible(false)
      }
      yPos += 16
    }

    if (this.currentCraftableItem) {
      this.craftableItemDetails.showItem(
        this.currentCraftableItem.item,
        this.itemToCraftDescription,
        inventory,
        this.onCraft as Function
      )
    }

    this.updateCurrHighlightPos(currPage)
  }

  updateCurrHighlightPos(currPage: any[]) {
    const startingX = this.craftableItemsListWrapper.x
    let yPos = this.craftableItemsListWrapper.y + 5
    const pageSize = this.getPageSize()
    for (let i = 0; i < pageSize; i++) {
      const item = currPage[i]
      if (item) {
        if (this.currentCraftableItem && item.name == this.currentCraftableItem.item.name) {
          const currYPos = yPos - 2
          const currXPos = startingX
          this.currHighlight.setPosition(currXPos, currYPos)
        }
      }
      yPos += 16
    }
  }
}
