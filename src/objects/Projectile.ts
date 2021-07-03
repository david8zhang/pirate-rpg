import { Direction } from '~/characters/Player'
import { Mob } from '../mobs/Mob'
import Game from '../scenes/Game'

interface ProjectileConfig {
  x: number
  y: number
  texture: string
  damage: number
}

export class Projectile {
  public scene: Game
  public damage: number
  public sprite: Phaser.Physics.Arcade.Sprite
  constructor(scene: Game, config: ProjectileConfig) {
    const { x, y, texture, damage } = config
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, texture)
    this.damage = damage
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setData('ref', this)
  }

  public onHit(mob: Mob) {
    this.sprite.destroy()
    mob.onHit(this.damage)
  }

  fire(direction: Direction, speed: number) {
    switch (direction) {
      case Direction.LEFT:
        this.sprite.setVelocityX(-speed)
        break
      case Direction.RIGHT:
        this.sprite.setVelocityX(speed)
        break
      case Direction.UP:
        this.sprite.setVelocityY(-speed)
        break
      case Direction.DOWN:
        this.sprite.setVelocityY(speed)
        break
    }
  }
}
