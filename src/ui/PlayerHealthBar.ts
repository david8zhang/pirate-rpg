import { Constants } from '~/utils/Constants'
import { HealthBar } from './HealthBar'

export class PlayerHealthBar extends HealthBar {
  private scene: Phaser.Scene
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const healthBarConfig = {
      x,
      y,
      width: Constants.HEALTH_BAR_WIDTH,
      height: Constants.HEALTH_BAR_HEIGHT,
      maxValue: Constants.MAX_HEALTH,
      fillColor: Constants.HEALTH_BAR_FILL_COLOR,
      showBorder: true,
      borderWidth: Constants.HEALTH_BAR_BORDER_WIDTH,
    }
    super(scene, healthBarConfig)
    this.scene = scene
    // this.healthBar = new HealthBar(this.scene, healthBarConfig)
    // this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(25, y + 6, 'heart')
    sprite.setScale(0.1)
    sprite.setDepth(2000)
  }
}
