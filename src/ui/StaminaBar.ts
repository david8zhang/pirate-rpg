import { Constants } from '~/utils/Constants'
import { HealthBar } from './HealthBar'

export class StaminaBar extends HealthBar {
  private scene: Phaser.Scene
  public position: { x: number; y: number }
  public icon: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const config = {
      x,
      y,
      width: Constants.HEALTH_BAR_WIDTH,
      height: Constants.HEALTH_BAR_HEIGHT,
      maxValue: Constants.MAX_HEALTH,
      fillColor: Constants.STAMINA_BAR_FILL_COLOR,
      showBorder: true,
      borderWidth: Constants.HEALTH_BAR_BORDER_WIDTH,
    }
    super(scene, config)
    this.scene = scene
    this.position = { x, y }
    this.icon = this.scene.add.sprite(25, y + 6, 'lightning-bolt')
    this.icon.setScale(0.08)
    this.icon.setDepth(2000)
    this.setVisible(false)
  }

  setVisible(isVisible: boolean) {
    super.setVisible(isVisible)
    this.icon.setVisible(isVisible)
  }
}
