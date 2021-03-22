import { InventoryMenu } from '../ui/InventoryMenu'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  constructor() {
    super('ui')
    UIScene._instance = this
  }

  create() {
    this.inventoryMenu = new InventoryMenu(this)
    this.inventoryMenu.initialize()
  }

  public static get instance() {
    return UIScene._instance
  }
}
