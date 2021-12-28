import { PlayerHealthBar } from '../ui/PlayerHealthBar'
import { InventoryMenu } from '../ui/InventoryMenu'
import { ItemTooltip } from '~/ui/ItemTooltip'
import { CraftingMenu } from '~/ui/CraftingMenu'
import { EquipmentMenu } from '~/ui/EquipmentMenu'
import { button } from '../ui/components/Button'
import Game from './Game'
import { text } from '~/ui/components/Text'
import { ShipUIScene } from './ShipUIScene'
import { MainMenuScene } from './MainMenuScene'
import { HealthBar } from '~/ui/HealthBar'
import { StaminaBar } from '~/ui/StaminaBar'

export default class UIScene extends Phaser.Scene {
  private static _instance: UIScene
  public inventoryMenu!: InventoryMenu
  public playerHealth!: PlayerHealthBar
  public playerStamina!: HealthBar
  public itemTooltip!: ItemTooltip
  public craftingMenu!: CraftingMenu
  public equipMenu!: EquipmentMenu
  public continueButton: HTMLElement | null = null
  public gameOverDomContainer!: Phaser.GameObjects.Container
  public pauseMenuDomContainer!: Phaser.GameObjects.Container
  public isShowingPauseMenu: boolean = false
  public pauseDisabled: boolean = false

  constructor() {
    super('ui')
    UIScene._instance = this
  }

  preload() {
    this.inventoryMenu = new InventoryMenu(this)
    this.inventoryMenu.initialize()
    this.playerHealth = new PlayerHealthBar(this, 27, this.scale.height - 34)
    this.playerStamina = new StaminaBar(this, 27, this.scale.height - 64)
    this.itemTooltip = new ItemTooltip(this, 0, 0)
    this.equipMenu = new EquipmentMenu(this)
    this.initGameOverElements()
    this.initPauseMenuElements()
    this.configureKeyPresses()
  }

  initGameOverElements() {
    this.gameOverDomContainer = this.add.container(0, 0)
    const continueButton = button('Continue', {
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
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 10, continueButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.resetGame()
      })

    const gameOverTextDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 60, gameOverText)
      .setOrigin(0, 0)

    this.gameOverDomContainer.add(continueButtonDom)
    this.gameOverDomContainer.add(gameOverTextDom)
    this.gameOverDomContainer.setVisible(false)
  }

  initPauseMenuElements() {
    this.pauseMenuDomContainer = this.add.container(0, 0)

    const pausedText = text('Paused', {
      fontFamily: 'GraphicPixel',
      fontSize: '20px',
    }) as HTMLElement
    const resumeButton = button('Resume', {
      fontFamily: 'GraphicPixel',
      fontSize: '12px',
      width: 100,
      height: 20,
    }) as HTMLElement
    const saveAndQuitButton = button('Save and Quit', {
      fontFamily: 'GraphicPixel',
      fontSize: '12px',
      width: 100,
      height: 20,
    }) as HTMLElement

    const pauseTextDom = this.add
      .dom(this.scale.width / 2 - 33, this.scale.height / 2 - 60, pausedText)
      .setOrigin(0, 0)

    const continueButtonDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 - 10, resumeButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.hidePauseMenu()
      })

    const saveAndQuitDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 + 20, saveAndQuitButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.scene.stop()
        Game.instance.saveAndQuit()
        ShipUIScene.instance.scene.stop()
        Game.instance.scene.stop()
        MainMenuScene.instance.scene.start()
      })

    this.pauseMenuDomContainer.add(pauseTextDom)
    this.pauseMenuDomContainer.add(continueButtonDom)
    this.pauseMenuDomContainer.add(saveAndQuitDom)
    this.pauseMenuDomContainer.setVisible(false)
  }

  resetGame() {
    Game.instance.restart()
  }

  create() {
    this.craftingMenu = new CraftingMenu(this)
  }

  update() {
    this.itemTooltip.update()
    const player = Game.instance.player
    this.playerStamina.setVisible(player.getIsSubmerged() || player.currStamina < player.maxStamina)
  }

  showPauseMenu() {
    this.pauseMenuDomContainer.setVisible(true)
    this.isShowingPauseMenu = true
    Game.instance.scene.pause()
  }

  hidePauseMenu() {
    this.pauseMenuDomContainer.setVisible(false)
    this.isShowingPauseMenu = false
    Game.instance.scene.resume()
  }

  showGameOver() {
    this.gameOverDomContainer.setVisible(true)
  }

  hideGameOver() {
    this.gameOverDomContainer.setVisible(false)
  }

  hide() {
    this.pauseDisabled = true
    this.scene.setVisible(false)
    if (this.inventoryMenu) {
      this.inventoryMenu.hide()
    }
  }

  show() {
    this.pauseDisabled = false
    this.scene.setVisible(true)
    if (this.inventoryMenu) {
      this.inventoryMenu.show()
    }
  }

  togglePauseMenu() {
    this.pauseMenuDomContainer.setVisible(!this.isShowingPauseMenu)
    this.isShowingPauseMenu = !this.isShowingPauseMenu
    if (this.isShowingPauseMenu) {
      Game.instance.scene.pause()
    } else {
      Game.instance.scene.resume()
    }
  }

  public static get instance() {
    return UIScene._instance
  }

  configureKeyPresses() {
    this.input.keyboard.on(
      'keydown',
      (keycode: any) => {
        if (keycode.code === 'Escape') {
          if (!this.pauseDisabled) {
            this.togglePauseMenu()
          }
        }
      },
      this
    )
  }
}
