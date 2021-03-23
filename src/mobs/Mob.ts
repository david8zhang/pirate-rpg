export interface MobConfig {
  textureKey: string
  x: number
  y: number
}

export class Mob {
  scene: Phaser.Scene
  x: number
  y: number
  sprite: Phaser.Physics.Arcade.Sprite
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    this.scene = scene
    const { x, y, textureKey } = mobConfig
    this.x = x
    this.y = y
    this.sprite = scene.physics.add.sprite(x, y, textureKey)
  }
}
