import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { ItemTooltip } from '~/ui/ItemTooltip'
import { CraftingMenu } from '~/ui/CraftingMenu'
import { EquipmentMenu } from '~/ui/EquipmentMenu'
import { button } from '../ui/components/Button'
import Game from './Game'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar
  public itemTooltip!: ItemTooltip
  public craftingMenu!: CraftingMenu
  public equipMenu!: EquipmentMenu
  public gameOverButton: HTMLElement | null = null
  public domElementsContainer!: Phaser.GameObjects.Container

  constructor() {
    super('ui')
    UIScene._instance = this
  }

  preload() {
    this.inventoryMenu = new InventoryMenu(this)
    this.inventoryMenu.initialize()
    this.playerHealth = new PlayerHealthBar(this)
    this.itemTooltip = new ItemTooltip(this, 0, 0)
    this.equipMenu = new EquipmentMenu(this)
    this.domElementsContainer = this.add.container(0, 0)

    this.gameOverButton = button('Game Over', {
      fontFamily: 'GraphicPixel',
      fontSize: '15px',
      width: 100,
      height: 20,
    }) as HTMLElement
    const gameOverButtonDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 10, this.gameOverButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.resetGame()
      })

    this.domElementsContainer.add(gameOverButtonDom)
    this.domElementsContainer.setVisible(false)
  }

  resetGame() {
    Game.instance.restart()
  }

  create() {
    this.craftingMenu = new CraftingMenu(this)
  }

  update() {
    this.itemTooltip.update()
  }

  showGameOver() {
    this.domElementsContainer.setVisible(true)
  }

  hideGameOver() {
    this.domElementsContainer.setVisible(false)
  }

  hide() {
    this.scene.setVisible(false)
  }

  show() {
    this.scene.setVisible(true)
  }

  public static get instance() {
    return UIScene._instance
  }
}
