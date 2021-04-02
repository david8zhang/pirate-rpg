import { MovementBehavior, Direction } from '~/lib/components/MovementBehavior'
import { DamageNumber } from '~/ui/DamageNumber'
import { Behavior } from '../lib/components/Behavior'
import { RandomMovementScript } from '../lib/components/RandomMovementBehavior'
import { HealthBar } from '../ui/HealthBar'

export interface MobConfig {
  textureKey: string
  x: number
  y: number
}

export interface MobAnimations {
  moveFront: string
  moveSide: string
  moveBack: string
  idleFront: string
  idleSide: string
  idleBack: string
  dieFront: string
  dieSide: string
  dieBack: string
  hurtFront: string
  hurtBack: string
  hurtSide: string
}

export abstract class Mob {
  scene: Phaser.Scene
  x: number
  y: number
  maxHealth: number
  health: number
  sprite: Phaser.Physics.Arcade.Sprite

  // Components
  moveBehavior: MovementBehavior
  healthBar: HealthBar
  animations: MobAnimations

  constructor(
    scene: Phaser.Scene,
    mobConfig: MobConfig,
    animations: MobAnimations,
    collidableLayers?: Phaser.Tilemaps.TilemapLayer[]
  ) {
    const { x, y, textureKey } = mobConfig
    this.scene = scene
    this.x = x
    this.y = y
    this.maxHealth = 100
    this.health = 100
    this.sprite = scene.physics.add.sprite(x, y, textureKey)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setPushable(false)
    this.animations = animations
    this.moveBehavior = new RandomMovementScript(this.sprite, scene, animations)

    const healthBarWidth = this.sprite.width * 1.5
    this.healthBar = new HealthBar(
      scene,
      this.sprite.x - healthBarWidth / 2,
      this.sprite.y - this.sprite.height,
      healthBarWidth,
      3
    )
    this.healthBar.setVisible(false)
    collidableLayers?.forEach((layer: Phaser.Tilemaps.TilemapLayer) => {
      this.scene.physics.add.collider(
        layer,
        this.sprite,
        (obj1: any, obj2: any) => this.handleTileCollision(obj1, obj2, animations),
        undefined,
        this
      )
    })
  }

  handleTileCollision(obj1: any, obj2: any, animations: any) {
    this.moveBehavior.handleTileCollision(obj1, obj2, animations)
  }

  die(): void {
    this.sprite.setVelocity(0)
    if (this.moveBehavior.direction === Direction.DOWN) {
      this.sprite.anims.play(this.animations.dieFront)
    } else if (this.moveBehavior.direction === Direction.UP) {
      this.sprite.anims.play(this.animations.dieBack)
    } else {
      this.sprite.anims.play(this.animations.dieSide)
    }
    this.moveBehavior.destroy()
    this.healthBar.destroy()
  }

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(0, this.health)
    this.healthBar.decrease(damage)
    this.healthBar.setVisible(true)
    DamageNumber.createDamageNumber(damage, this.scene, this.sprite.x, this.sprite.y - 10)
  }

  update() {
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2
    this.healthBar.y = this.sprite.y - this.sprite.height
    this.healthBar.draw()
    this.moveBehavior.update()
  }
}
