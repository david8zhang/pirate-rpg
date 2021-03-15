import Phaser from 'phaser'

export default class PalmTree extends Phaser.Physics.Arcade.Sprite {
  public hasCoconuts: boolean = true

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.body.setSize(this.width * 0.2, this.height * 0.1)
    this.body.offset.y = 57
    this.setPushable(false)
  }

  create() {}
}
