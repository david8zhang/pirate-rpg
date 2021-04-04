export class DamageNumber {
  static createDamageNumber(damageNumber: number, scene: Phaser.Scene, x: number, y: number) {
    const text = scene.add
      .text(x, y, `-${damageNumber}`, {
        fontSize: '10px',
        fontFamily: 'GraphicPixel',
        color: 'red',
      })
      .setOrigin(0.5)
    scene.add.tween({
      targets: text,
      duration: 800,
      ease: 'Exponential.In',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
      y: y - 50,
      onComplete: () => {
        text.destroy()
      },
    })
  }
}
