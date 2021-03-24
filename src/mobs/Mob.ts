import { MovementScript } from '~/lib/components/MovementScript'
import { RandomMovementScript } from '~/lib/components/RandomMovementScript'

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

  // Components
  randMoveComp: MovementScript

  constructor(
    scene: Phaser.Scene,
    mobConfig: MobConfig,
    animations: { move: string; idle: string }
  ) {
    this.scene = scene
    const { x, y, textureKey } = mobConfig
    this.x = x
    this.y = y
    this.sprite = scene.physics.add.sprite(x, y, textureKey)
    this.randMoveComp = new RandomMovementScript(this.sprite, scene, animations)
  }

  update() {
    this.randMoveComp.update()
  }
}
