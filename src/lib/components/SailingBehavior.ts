import { Mob } from '~/mobs/Mob'
import { Behavior } from './Behavior'
import { Direction } from '~/characters/Player'
import { EnemyShip } from '~/objects/EnemyShip'
import Game from '~/scenes/Game'

export class SailingBehavior implements Behavior {
  private mob: Mob
  private ship: EnemyShip
  private moveShipEvent!: Phaser.Time.TimerEvent
  private currDirection: Direction | null = null
  public followingPlayer: boolean = false
  public fireDelay: number = 5000
  public firedCannon: boolean = false
  public isStopped: boolean = false
  public name: string = 'SAIL'

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
    this.isStopped = false
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
    const source = this.ship.getCenterPoint()
    const target = gameScene.player.ship?.getCenterPoint()
    const dx = Math.floor(source.x - target?.x)
    const dy = Math.floor(source.y - target?.y)

    const playerShip = gameScene.player.ship
    if (playerShip) {
      if (
        (playerShip.currDirection === Direction.DOWN ||
          playerShip.currDirection === Direction.UP) &&
        Math.abs(dx) >= 200
      ) {
        this.fireCannon()
        if (Math.abs(dy) >= 20) {
          return dy > 0 ? Direction.UP : Direction.DOWN
        } else {
          return undefined
        }
      }
      if (
        (playerShip.currDirection === Direction.LEFT ||
          playerShip.currDirection === Direction.RIGHT) &&
        Math.abs(dy) <= 450
      ) {
        this.fireCannon()
        if (Math.abs(dx) >= 20) {
          return dx > 0 ? Direction.LEFT : Direction.RIGHT
        } else {
          return undefined
        }
      }

      // If the dx is less than dy, move along the y axis
      if (Math.abs(dx) < Math.abs(dy) || dx === 0) {
        // If dy > 0, then the current mob is below the player
        if (dy > 0) {
          return Direction.UP
        } else {
          return Direction.DOWN
        }
      } else if (Math.abs(dy) < Math.abs(dx) || dy === 0) {
        // If dx > 0, then the current mob is to the right of the player
        if (dx > 0) {
          return Direction.LEFT
        } else {
          return Direction.RIGHT
        }
      }
    }
  }

  fireCannon() {
    if (!this.firedCannon && !this.isStopped) {
      this.ship.fireAllCannons()
      this.firedCannon = true
      this.mob.scene.time.delayedCall(this.fireDelay, () => {
        this.firedCannon = false
      })
    }
  }

  getDirectionOfPlayerShip() {
    const gameScene = this.mob.scene as Game
    if (gameScene.player && gameScene.player.ship) {
      return gameScene.player.ship.currDirection
    }
  }

  // If damage is taken, follow the player ship
  followPlayer() {
    this.moveShipEvent.destroy()
    this.followingPlayer = true
  }

  stopFollowingPlayer() {
    this.moveShipEvent = this.mob.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.moveShipRandomly()
      },
      loop: true,
    })
    this.followingPlayer = false
  }

  stop() {
    this.moveShipEvent.destroy()
    this.isStopped = true
  }

  checkPlayerDead() {
    const gameScene = this.mob.scene as Game
    if (gameScene.player.isDead) {
      this.followingPlayer = false
      this.isStopped = false
      this.moveShipEvent = this.mob.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.moveShipRandomly()
        },
        loop: true,
      })
    }
  }

  disable() {}
  destroy() {}
  handleTileCollision(obj1: any, obj2: any, animations: any): void {}
  update() {
    if (this.isStopped) {
      return
    }
    if (this.followingPlayer) {
      this.checkPlayerDead()
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
