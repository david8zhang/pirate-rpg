import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { ItemTooltip } from '~/ui/ItemTooltip'
import { CraftingMenu } from '~/ui/CraftingMenu'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar
  public itemTooltip!: ItemTooltip
  public craftingMenu!: CraftingMenu

  constructor() {
    super('ui')
    UIScene._instance = this
  }

  preload() {
    this.inventoryMenu = new InventoryMenu(this)
    this.inventoryMenu.initialize()
    this.playerHealth = new PlayerHealthBar(this)
    this.itemTooltip = new ItemTooltip(this, 0, 0)
  }

  create() {
    this.craftingMenu = new CraftingMenu(this)
  }

  update() {
    this.itemTooltip.update()
  }

  hide() {
    this.scene.setVisible(false)
  }

  public static get instance() {
    return UIScene._instance
  }
}
