import { text } from '~/ui/components/Text'
import { button } from '../ui/components/Button'

export class MainMenuScene extends Phaser.Scene {
  private static _instance: MainMenuScene
  public continueButton: HTMLElement | null = null
  public domElementsContainer!: Phaser.GameObjects.Container

  constructor() {
    super('menu-ui')
    MainMenuScene._instance = this
  }

  public static get instance() {
    return this._instance
  }

  preload() {
    this.domElementsContainer = this.add.container(0, 0)

    const gameOverText = text('Avast!', {
      fontFamily: 'GraphicPixel',
      fontSize: '30px',
      color: 'black',
    }) as HTMLElement

    const hasSaveFile = localStorage.getItem('saveFile') != undefined

    this.continueButton = button(hasSaveFile ? 'Continue' : 'Play', {
      fontFamily: 'GraphicPixel',
      fontSize: '12px',
      width: 100,
      height: 20,
    }) as HTMLElement

    const continueButtonDom = this.add
      .dom(this.scale.width / 2 - 50, this.scale.height / 2 + 10, this.continueButton)
      .setOrigin(0, 0)
      .addListener('click')
      .on('click', () => {
        this.scene.start('game')
        this.scene.start('ui')
        this.scene.start('ship-ui')
      })

    if (hasSaveFile) {
      const startNewGame = button('New Game', {
        fontFamily: 'GraphicPixel',
        fontSize: '12px',
        width: 100,
        height: 20,
      }) as HTMLElement

      const startNewGameDom = this.add
        .dom(this.scale.width / 2 - 50, this.scale.height / 2 + 35, startNewGame)
        .setOrigin(0, 0)
        .addListener('click')
        .on('click', () => {
          localStorage.clear()
          this.scene.start('game')
          this.scene.start('ui')
          this.scene.start('ship-ui')
        })

      this.domElementsContainer.add(startNewGameDom)
    }

    const gameOverTextDom = this.add
      .dom(this.scale.width / 2 - 42, this.scale.height / 2 - 60, gameOverText)
      .setOrigin(0)

    this.domElementsContainer.add(continueButtonDom)
    this.domElementsContainer.add(gameOverTextDom)
  }

  create() {
    this.add.image(0, 0, 'splash').setOrigin(0, 0)
  }
}
