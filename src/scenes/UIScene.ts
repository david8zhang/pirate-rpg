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
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url:
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI',
    })

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

  public static get instance() {
    return UIScene._instance
  }
}
