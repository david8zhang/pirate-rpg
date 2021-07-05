import { HealthBar } from './HealthBar'

export class ShipHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const height = this.scene.scale.height * 2
    this.healthBar = new HealthBar(this.scene, 27, height - 34, 200, 20, 100, 0x2ecc71, true)
    this.healthBar.setVisible(true)
  }

  public takeDamage(damage: number) {
    this.healthBar.decrease(damage)
  }

  setMaxHealth(health: number) {
    this.healthBar.maxValue = health
  }

  setCurrHealth(health: number) {
    this.healthBar.currValue = health
  }
}
