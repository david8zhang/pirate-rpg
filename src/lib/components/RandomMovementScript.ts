import { MovementScript, MoveState, Direction } from './MovementScript'

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3)
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3)
  }
  return newDirection
}

export class RandomMovementScript implements MovementScript {
  private sprite: Phaser.Physics.Arcade.Sprite
  private scene: Phaser.Scene

  public direction = Direction.RIGHT
  public moveEvent!: Phaser.Time.TimerEvent
  public state: MoveState = MoveState.MOVING
  private onMove?: Function
  private isStopped: boolean = false

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    animations: {
      moveFront: string
      moveSide: string
      idleFront: string
      idleSide: string
    },
    onMoveFn?: Function
  ) {
    this.sprite = sprite
    this.scene = scene
    this.sprite.anims.play(animations.idleFront)
    this.direction = randomDirection(Direction.RIGHT)
    this.moveEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.randomMoveOrStop(animations)
      },
      loop: true,
    })
    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
        this.handleTileCollision(go, tile, animations)
      },
      this
    )
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
    this.randomMoveOrStop(animations)
  }

  randomMoveOrStop(animations: {
    moveSide: string
    moveFront: string
    idleFront: string
    idleSide: string
  }) {
    this.state = [MoveState.MOVING, MoveState.STOPPED][Math.floor(Math.random() * 2)]
    if (this.state === MoveState.MOVING) {
      this.direction = randomDirection(this.direction)
      if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
        this.sprite.anims.play(animations.moveSide)
      } else {
        this.sprite.anims.play(animations.moveFront)
      }
    } else {
      if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
        this.sprite.anims.play(animations.idleSide)
      } else {
        this.sprite.anims.play(animations.idleFront)
      }
    }
  }

  destroy() {
    this.moveEvent.destroy()
  }

  start() {
    this.isStopped = false
  }

  stop() {
    this.isStopped = true
  }

  update() {
    const speed = 50
    if (this.isStopped) {
      if (this.sprite.active && this.sprite.setVelocity) {
        this.sprite.setVelocity(0)
      }
      return
    }
    if (this.state === MoveState.MOVING) {
      switch (this.direction) {
        case Direction.UP: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(0, -speed)
          break
        }
        case Direction.DOWN: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(0, speed)
          break
        }
        case Direction.LEFT: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(-speed, 0)
          break
        }
        case Direction.RIGHT: {
          if (this.onMove) this.onMove(this.direction)
          this.sprite.setVelocity(speed, 0)
          break
        }
      }
    } else {
      this.sprite.setVelocity(0)
    }
  }
}
