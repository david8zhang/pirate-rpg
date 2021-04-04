import { HealthBar } from './HealthBar'

export class PlayerHealthBar {
  private scene: Phaser.Scene
  private healthBar: HealthBar
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.healthBar = new HealthBar(this.scene, 27, 370, 150, 10, 0x2ecc71, true)
    this.healthBar.setVisible(true)
    const sprite = this.scene.add.sprite(25, 372, 'heart')
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
