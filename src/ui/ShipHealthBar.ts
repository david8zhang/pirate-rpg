import { HealthBar } from './HealthBar'

export class ShipHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const height = this.scene.scale.height * 2

    const healthBarConfig = {
      x: 54,
      y: height - 68,
      width: 300,
      height: 30,
      maxValue: 100,
      fillColor: 0x2ecc71,
      showBorder: true,
      borderWidth: 8,
    }
    this.healthBar = new HealthBar(this.scene, healthBarConfig)
    this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(50, height - 56, 'brig-icon')
    sprite.setScale(4, 4)
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
