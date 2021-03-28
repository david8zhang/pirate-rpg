import { Direction, MovementScript } from '../lib/components/MovementScript'
import { RandomMovementScript } from '../lib/components/RandomMovementScript'
import { HealthBar } from '../ui/HealthBar'

export interface MobConfig {
  textureKey: string
  x: number
  y: number
}

export interface MobAnimations {
  moveFront: string
  moveSide: string
  idleFront: string
  idleSide: string
  dieFront: string
  dieSide: string
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
  healthBar: HealthBar
  animations: MobAnimations

  constructor(scene: Phaser.Scene, mobConfig: MobConfig, animations: MobAnimations) {
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
    this.animations = animations
    this.moveComp = new RandomMovementScript(this.sprite, scene, animations)

    const healthBarWidth = this.sprite.width * 1.5
    this.healthBar = new HealthBar(
      scene,
      this.sprite.x - healthBarWidth / 2,
      this.sprite.y - this.sprite.height,
      healthBarWidth,
      3
    )
    this.healthBar.setVisible(false)
  }

  die(): void {
    this.sprite.setVelocity(0)
    if (this.moveComp.direction === Direction.UP || this.moveComp.direction === Direction.DOWN) {
      this.sprite.anims.play(this.animations.dieSide)
    } else {
      this.sprite.anims.play(this.animations.dieFront)
    }
    this.moveComp.destroy()
    this.healthBar.destroy()
  }

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(0, this.health)
    this.healthBar.decrease(damage)
    this.healthBar.setVisible(true)
  }

  update() {
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2
    this.healthBar.y = this.sprite.y - this.sprite.height
    this.healthBar.draw()
    this.moveComp.update()
  }
}
