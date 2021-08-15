import { text } from '~/ui/components/Text'
import { button } from '../ui/components/Button'

export class MenuUIScene extends Phaser.Scene {
  public continueButton: HTMLElement | null = null
  public domElementsContainer!: Phaser.GameObjects.Container

  constructor() {
    super('menu-ui')
  }

  preload() {
    this.domElementsContainer = this.add.container(0, 0)

    const gameOverText = text('Avast!', {
      fontFamily: 'GraphicPixel',
      fontSize: '30px',
      color: 'black',
    }) as HTMLElement

    this.continueButton = button('Play', {
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
