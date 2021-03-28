export class HealthBar {
  bar: Phaser.GameObjects.Graphics
  x: number
  y: number
  maxValue: number
  currValue: number

  height: number
  width: number

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene)
    this.x = x
    this.y = y
    this.maxValue = 100
    this.currValue = 100
    this.width = width
    this.height = height
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

  draw() {
    this.bar.clear()

    // BG
    this.bar.fillStyle(0x00000)
    this.bar.fillRect(this.x, this.y, this.width, this.height)

    const percentage = this.currValue / this.maxValue

    if (percentage < 0.2) {
      this.bar.fillStyle(0xff0000)
    } else {
      this.bar.fillStyle(0x00ff00)
    }

    const length = Math.floor(percentage * this.width)
    this.bar.fillRect(this.x, this.y, length, this.height)
  }

  destroy() {
    this.bar.destroy()
  }
}
