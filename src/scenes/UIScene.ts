import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { PickupObjectText } from '../ui/PickupObjectText'
import { ItemTooltip } from '~/ui/ItemTooltip'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar
  public itemTooltip!: ItemTooltip

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

  update() {
    this.itemTooltip.update()
  }

  public static get instance() {
    return UIScene._instance
  }
}
