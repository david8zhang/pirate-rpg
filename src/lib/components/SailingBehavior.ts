import Player from '~/characters/Player'
import { Mob } from '~/mobs/Mob'
import { Ship } from '~/objects/Ship'
import { Behavior } from './Behavior'
import { Direction } from '../../characters/player'
import { EnemyShip } from '~/objects/EnemyShip'
import Game from '~/scenes/Game'

export class SailingBehavior implements Behavior {
  private mob: Mob
  private ship: EnemyShip
  private moveShipEvent!: Phaser.Time.TimerEvent
  private currDirection: Direction | null = null
  public followingPlayer: boolean = false

  constructor(mob: Mob, ship: EnemyShip) {
    this.mob = mob
    this.ship = ship
  }
  start() {
    this.ship.setMobInControl(this.mob)
    this.moveShipEvent = this.mob.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.moveShipRandomly()
      },
      loop: true,
    })
  }

  moveShipRandomly() {
    if (this.followingPlayer) {
      this.currDirection = this.getDirectionToMove()
      return
    }
    const directions = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT, 'stop']
    const randDirection = directions[Math.floor(Math.random() * directions.length)]
    if (randDirection !== 'stop') {
      this.currDirection = randDirection as Direction
    } else {
      this.currDirection = null
    }
  }

  getDirectionToMove(): any {
    const gameScene = this.mob.scene as Game
    const target = gameScene.player.ship ? gameScene.player.ship.hullSprite : gameScene.player
    return undefined
  }

  getDirectionOfPlayerShip() {
    const gameScene = this.mob.scene as Game
    if (gameScene.player && gameScene.player.ship) {
      return gameScene.player.ship.currDirection
    }
  }

  // If damage is taken, follow the player ship
  takeDamage() {
    this.moveShipEvent.destroy()
    this.followingPlayer = true
  }

  stop() {
    this.moveShipEvent.destroy()
  }
  disable() {}
  destroy() {}
  handleTileCollision(obj1: any, obj2: any, animations: any): void {}
  update() {
    if (this.followingPlayer) {
      const direction = this.getDirectionToMove()
      if (direction !== undefined) {
        this.ship.moveShip(direction)
      } else {
        this.ship.stop()
      }
    } else {
      if (this.currDirection) {
        this.ship.destroyAllColliders()
        this.ship.moveShip(this.currDirection)
      } else {
        this.ship.stop()
      }
    }
  }
}
