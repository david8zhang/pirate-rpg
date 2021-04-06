import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { PickupObjectText } from '../ui/PickupObjectText'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar

  constructor() {
    super('ui')
    UIScene._instance = this
  }

  preload() {
    this.inventoryMenu = new InventoryMenu(this)
    this.inventoryMenu.initialize()
    this.playerHealth = new PlayerHealthBar(this)
  }

  public static get instance() {
    return UIScene._instance
  }
}
