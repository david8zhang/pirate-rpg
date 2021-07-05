import { HealthBar } from './HealthBar'

export class ShipHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const height = this.scene.scale.height * 2
    this.healthBar = new HealthBar(this.scene, 27, height - 34, 200, 20, 100, 0x2ecc71, true)
    this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(25, height - 28, 'sloop-icon')
    sprite.setScale(2, 2)
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
