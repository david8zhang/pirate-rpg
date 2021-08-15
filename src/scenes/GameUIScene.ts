import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { ItemTooltip } from '~/ui/ItemTooltip'
import { CraftingMenu } from '~/ui/CraftingMenu'
import { EquipmentMenu } from '~/ui/EquipmentMenu'
import { button } from '../ui/components/Button'
import Game from './Game'
import { text } from '~/ui/components/Text'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar
  public itemTooltip!: ItemTooltip
  public craftingMenu!: CraftingMenu
  public equipMenu!: EquipmentMenu
  public continueButton: HTMLElement | null = null
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

    this.continueButton = button('Continue', {
      fontFamily: 'GraphicPixel',
      fontSize: '12px',
      width: 100,
      height: 20,
    }) as HTMLElement

    const gameOverText = text('Game Over', {
      fontFamily: 'GraphicPixel',
      fontSize: '20px',
    }) as HTMLElement

    const continueButtonDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 10, this.continueButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.resetGame()
      })

    const gameOverTextDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 60, gameOverText)
      .setOrigin(0, 0)

    this.domElementsContainer.add(continueButtonDom)
    this.domElementsContainer.add(gameOverTextDom)
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
