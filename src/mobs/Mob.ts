import { MovementScript } from '~/lib/components/MovementScript'
import { RandomMovementScript } from '~/lib/components/RandomMovementScript'
import Game from '~/scenes/Game'

export interface MobConfig {
  textureKey: string
  x: number
  y: number
}

export abstract class Mob {
  scene: Phaser.Scene
  x: number
  y: number
  maxHealth: number
  health: number
  sprite: Phaser.Physics.Arcade.Sprite

  // Components
  moveComp: MovementScript

  constructor(
    scene: Phaser.Scene,
    mobConfig: MobConfig,
    animations: { moveFront: string; moveSide: string; idleFront: string; idleSide: string }
  ) {
    const { x, y, textureKey } = mobConfig
    this.scene = scene
    this.x = x
    this.y = y
    this.maxHealth = 100
    this.health = 100
    this.sprite = scene.physics.add.sprite(x, y, textureKey)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.onCollide = true
    this.sprite.setPushable(false)
    this.moveComp = new RandomMovementScript(this.sprite, scene, animations)
  }

  abstract die(): void

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(0, this.health)
  }

  update() {
    this.moveComp.update()
  }
}
