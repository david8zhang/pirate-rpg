import { HealthBar } from './HealthBar'

export class PlayerHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const height = this.scene.scale.height
    this.healthBar = new HealthBar(this.scene, 27, height - 34, 150, 15, 0x2ecc71, true)
    this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(25, height - 28, 'heart')
    sprite.setScale(0.1)
    sprite.setDepth(2000)
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
