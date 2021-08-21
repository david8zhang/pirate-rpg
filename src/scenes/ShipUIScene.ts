import { button } from '~/ui/components/Button'
import { text } from '~/ui/components/Text'
import { ShipHealthBar } from '../ui/ShipHealthBar'
import Game from './Game'
import UIScene from './GameUIScene'
import { MainMenuScene } from './MainMenuScene'

export class ShipUIScene extends Phaser.Scene {
  private static _instance: ShipUIScene
  public shipHealthBar!: ShipHealthBar
  public pauseMenuDomContainer!: Phaser.GameObjects.Container
  public isShowingPauseMenu: boolean = false
  public pauseDisabled: boolean = false

  constructor() {
    super('ship-ui')
    ShipUIScene._instance = this
  }

  preload() {
    this.shipHealthBar = new ShipHealthBar(this)
    this.initPauseMenuElements()
    this.configureKeyPresses()
  }

  initPauseMenuElements() {
    this.pauseMenuDomContainer = this.add.container(0, 0)

    const pausedText = text('Paused', {
      fontFamily: 'GraphicPixel',
      fontSize: '40px',
    }) as HTMLElement
    const resumeButton = button('Resume', {
      fontFamily: 'GraphicPixel',
      fontSize: '24px',
      width: 200,
      height: 40,
    }) as HTMLElement
    const saveAndQuitButton = button('Save and Quit', {
      fontFamily: 'GraphicPixel',
      fontSize: '24px',
      width: 200,
      height: 40,
    }) as HTMLElement

    const pauseTextDom = this.add
      .dom(this.scale.width - 66, this.scale.height - 120, pausedText)
      .setOrigin(0, 0)

    const continueButtonDom = this.add
      .dom(this.scale.width - 100, this.scale.height - 20, resumeButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.hidePauseMenu()
      })

    const saveAndQuitDom = this.add
      .dom(this.scale.width - 100, this.scale.height + 40, saveAndQuitButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.scene.stop()
        Game.instance.disableShipCamera()
        Game.instance.saveAndQuit()
        UIScene.instance.scene.stop()
        ShipUIScene.instance.scene.stop()
        Game.instance.scene.stop()
        MainMenuScene.instance.scene.start()
      })

    this.pauseMenuDomContainer.add(pauseTextDom)
    this.pauseMenuDomContainer.add(continueButtonDom)
    this.pauseMenuDomContainer.add(saveAndQuitDom)
    this.pauseMenuDomContainer.setVisible(false)
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

  hide() {
    this.pauseDisabled = true
    this.scene.setVisible(false)
  }

  show() {
    this.pauseDisabled = false
    this.scene.setVisible(true)
  }

  public static get instance() {
    return ShipUIScene._instance
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

  togglePauseMenu() {
    this.pauseMenuDomContainer.setVisible(!this.isShowingPauseMenu)
    this.isShowingPauseMenu = !this.isShowingPauseMenu
    if (this.isShowingPauseMenu) {
      Game.instance.scene.pause()
    } else {
      Game.instance.scene.resume()
    }
  }
}
