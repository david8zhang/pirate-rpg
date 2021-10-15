import { AnimationType } from '~/utils/Constants'
import { Direction } from './Behavior'
import { MovementBehavior, MoveState } from './MovementBehavior'

const randomDirection = (exclude: Direction | null) => {
  let newDirection = Phaser.Math.Between(0, 3)
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3)
  }
  return newDirection
}

export class RandomMovementBehavior extends MovementBehavior {
  private sprite: Phaser.Physics.Arcade.Sprite
  private scene: Phaser.Scene
  private isStopped: boolean = false
  private animations: {
    [key: string]: string
  }

  public direction: Direction | null = null
  public moveEvent!: Phaser.Time.TimerEvent
  public state: MoveState = MoveState.MOVING
  public speed: number = 50
  public onMove: Function = () => {}
  public name: string = 'RANDOM_MOVE'

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    animations: {
      [key: string]: string
    },
    onMoveFn?: Function
  ) {
    super()
    this.animations = animations
    this.sprite = sprite
    this.scene = scene

    if (this.sprite && this.sprite.anims) {
      this.sprite.anims.play(animations[AnimationType.IDLE_FRONT])
      this.moveEvent = this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.randomMoveOrStop()
        },
        loop: true,
      })
      if (onMoveFn) {
        this.onMove = onMoveFn
      }
    }
  }

  handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile,
    animations: any
  ) {
    if (go !== this.sprite) {
      return
    }
    this.randomMoveOrStop()
  }

  randomMoveOrStop() {
    if (!this.isStopped) {
      this.state = [MoveState.MOVING, MoveState.STOPPED][Math.floor(Math.random() * 2)]
      if (this.state === MoveState.MOVING) {
        this.direction = randomDirection(this.direction)
      }
      this.playAnimsBasedOnDirection()
    }
  }

  playAnimsBasedOnDirection() {
    const animation = this._getAnimBasedOnDirection()
    if (animation && this.sprite.active) {
      this.sprite.anims.play(animation)
    }
  }

  private _getAnimBasedOnDirection() {
    const isMoving = this.state === MoveState.MOVING
    switch (this.direction) {
      case Direction.UP: {
        return isMoving
          ? this.animations[AnimationType.WALK_BACK]
          : this.animations[AnimationType.IDLE_BACK]
      }
      case Direction.DOWN: {
        return isMoving
          ? this.animations[AnimationType.WALK_FRONT]
          : this.animations[AnimationType.IDLE_FRONT]
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        return isMoving
          ? this.animations[AnimationType.WALK_SIDE]
          : this.animations[AnimationType.IDLE_SIDE]
      }
      default:
        return this.animations[AnimationType.IDLE_FRONT]
    }
  }

  destroy() {
    this.stop()
    this.moveEvent.destroy()
  }

  start() {
    this.isStopped = false
  }

  stop() {
    if (this.sprite.active) {
      this.sprite.setVelocity(0)
    }
    this.isStopped = true
  }

  disable() {}

  update() {
    // If the mob is currently stopped, don't add velocity
    if (this.isStopped) {
      if (this.sprite.active && this.sprite.setVelocity) {
        this.sprite.setVelocity(0)
      }
      return
    }

    // Play the move animation if the mob was moving
    if (this.sprite.anims && this.sprite.anims.getName() !== this._getAnimBasedOnDirection()) {
      this.playAnimsBasedOnDirection()
    }

    // Move the mob based on its direction
    if (this.state === MoveState.MOVING) {
      switch (this.direction) {
        case Direction.UP: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(0, -this.speed)
          break
        }
        case Direction.DOWN: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(0, this.speed)
          break
        }
        case Direction.LEFT: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(-this.speed, 0)
          break
        }
        case Direction.RIGHT: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(this.speed, 0)
          break
        }
      }
    } else {
      this.sprite.setVelocity(0)
    }
  }
}
