import { MobAnimations } from '../../mobs/Mob'
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
  private animations: MobAnimations

  public direction: Direction | null = null
  public moveEvent!: Phaser.Time.TimerEvent
  public state: MoveState = MoveState.MOVING
  public speed: number = 50
  public onMove: Function = () => {}

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    animations: MobAnimations,
    onMoveFn?: Function
  ) {
    super()
    this.animations = animations
    this.sprite = sprite
    this.scene = scene
    this.sprite.anims.play(animations.idleFront)
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
        return isMoving ? this.animations.moveBack : this.animations.idleBack
      }
      case Direction.DOWN: {
        return isMoving ? this.animations.moveFront : this.animations.idleFront
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        return isMoving ? this.animations.moveSide : this.animations.idleSide
      }
      default:
        return this.animations.idleFront
    }
  }

  destroy() {
    this.moveEvent.destroy()
  }

  start() {
    this.isStopped = false
  }

  stop() {
    this.sprite.setVelocity(0)
    this.isStopped = true
  }

  update() {
    // If the mob is currently stopped, don't add velocity
    if (this.isStopped) {
      if (this.sprite.active && this.sprite.setVelocity) {
        this.sprite.setVelocity(0)
      }
      return
    }

    // Play the move animation if the mob was moving
    if (this.sprite.anims.getName() !== this._getAnimBasedOnDirection()) {
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