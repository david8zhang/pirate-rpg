import { Direction } from '~/characters/Player'
import { ALL_EFFECTS } from '~/utils/Constants'
import { Mob } from '../mobs/Mob'
import Game from '../scenes/Game'
import { EffectSpawner } from './Effect'
import { Harvestable } from './Harvestable'
import { Ship } from './Ship'

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
  public sourceShip?: Ship
  private static TIME_TO_LIVE = 5000
  constructor(scene: Game, config: ProjectileConfig) {
    const { x, y, texture, damage } = config
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, texture)
    this.damage = damage
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setData('ref', this)
  }

  public setSourceShip(ship: Ship) {
    this.sourceShip = ship
  }

  public onHitShip(ship: Ship) {
    EffectSpawner.instance.spawnEffect(ALL_EFFECTS[0], this.sprite.x, this.sprite.y)
    this.sprite.destroy()
    if (ship && ship !== this.sourceShip) {
      ship.takeDamage(this.damage)
    }
  }

  public onHitMob(mob: Mob) {
    EffectSpawner.instance.spawnEffect(ALL_EFFECTS[0], this.sprite.x, this.sprite.y)
    this.sprite.destroy()
    mob.onHit(this.damage)
  }

  public onHitHarvestable(harvestable: Harvestable) {
    EffectSpawner.instance.spawnEffect(ALL_EFFECTS[0], this.sprite.x, this.sprite.y)
    this.sprite.destroy()
    harvestable.takeDamage(this.damage)
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
    this.scene.time.delayedCall(Projectile.TIME_TO_LIVE, () => {
      this.sprite.destroy()
    })
  }
}
