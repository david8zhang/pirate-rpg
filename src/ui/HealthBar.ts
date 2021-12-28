interface HealthBarConfig {
  x: number
  y: number
  maxValue: number
  height: number
  width: number
  borderWidth: number
  fillColor?: number
  showBorder?: boolean
}

export class HealthBar {
  bar: Phaser.GameObjects.Graphics
  x: number
  y: number
  maxValue: number
  currValue: number

  height: number
  width: number
  fillColor: number
  showBorder: boolean
  borderWidth: number

  constructor(scene: Phaser.Scene, healthBarConfig: HealthBarConfig) {
    this.bar = new Phaser.GameObjects.Graphics(scene)
    const { x, y, maxValue, width, height, fillColor, showBorder, borderWidth } = healthBarConfig
    this.x = x
    this.y = y
    this.maxValue = maxValue
    this.currValue = maxValue
    this.width = width
    this.height = height
    this.borderWidth = borderWidth

    this.fillColor = fillColor || 0x2ecc71
    this.showBorder = showBorder || false
    scene.add.existing(this.bar)
    this.draw()
    this.bar.setDepth(1000)
  }

  setVisible(visible: boolean) {
    this.bar.setVisible(visible)
  }

  decrease(amount: number) {
    this.currValue = Math.max(0, this.currValue - amount)
    this.draw()
    return this.currValue === 0
  }

  increase(amount: number) {
    this.currValue = Math.min(this.maxValue, this.currValue + amount)
    this.draw()
    return this.currValue === this.maxValue
  }

  setMaxHealth(maxHealth: number) {
    this.maxValue = maxHealth
    this.draw()
  }

  setCurrHealth(currHealth: number) {
    this.currValue = currHealth
    this.draw()
  }

  draw() {
    this.bar.clear()

    // Border
    const borderWidth = this.showBorder ? this.borderWidth : 0
    this.bar.fillStyle(0x000000)
    this.bar.fillRect(
      this.x - borderWidth / 2,
      this.y - borderWidth / 2,
      this.width + borderWidth,
      this.height + borderWidth
    )

    const percentage = this.currValue / this.maxValue

    if (percentage <= 0.25) {
      this.bar.fillStyle(0xff0000)
    } else if (percentage <= 0.5) {
      this.bar.fillStyle(0xf1c40f)
    } else {
      this.bar.fillStyle(this.fillColor)
    }

    const length = Math.floor(percentage * this.width)
    this.bar.fillRect(this.x, this.y, length, this.height)
  }

  destroy() {
    this.bar.destroy()
  }
}
