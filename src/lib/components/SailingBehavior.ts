import Player from '~/characters/Player'
import { Mob } from '~/mobs/Mob'
import { Ship } from '~/objects/Ship'
import { Behavior } from './Behavior'
import { Direction } from '../../characters/player'

export class SailingBehavior implements Behavior {
  private mob: Mob
  private ship: Ship
  private moveShipEvent!: Phaser.Time.TimerEvent
  private currDirection: Direction | null = null

  constructor(mob: Mob, ship: Ship) {
    this.mob = mob
    this.ship = ship
  }
  start() {
    this.ship.mobInControl = this.mob
    this.moveShipEvent = this.mob.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.moveShipRandomly()
      },
      loop: true,
    })
  }

  moveShipRandomly() {
    const directions = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT, 'stop']
    const randDirection = directions[Math.floor(Math.random() * directions.length)]
    if (randDirection !== 'stop') {
      this.currDirection = randDirection as Direction
    } else {
      this.currDirection = null
    }
  }

  stop() {
    this.moveShipEvent.destroy()
  }
  disable() {}
  destroy() {}
  handleTileCollision(obj1: any, obj2: any, animations: any): void {}
  update() {
    if (this.currDirection) {
      this.ship.destroyAllColliders()
      this.ship.moveShip(this.currDirection)
    } else {
      this.ship.stop()
    }
  }
}
