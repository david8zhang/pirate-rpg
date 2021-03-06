import { HealthBar } from './HealthBar'

export class PlayerHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const height = this.scene.scale.height
    const healthBarConfig = {
      x: 27,
      y: height - 34,
      width: 150,
      height: 15,
      maxValue: 100,
      fillColor: 0x2ecc71,
      showBorder: true,
      borderWidth: 4,
    }
    this.healthBar = new HealthBar(this.scene, healthBarConfig)
    this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(25, height - 28, 'heart')
    sprite.setScale(0.1)
    sprite.setDepth(2000)
  }

  public takeDamage(damage: number) {
    this.healthBar.decrease(damage)
  }

  setMaxHealth(health: number) {
    this.healthBar.setMaxHealth(health)
  }

  setCurrHealth(health: number) {
    this.healthBar.setCurrHealth(health)
  }
}
