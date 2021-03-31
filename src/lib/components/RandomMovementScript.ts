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
    animations: any,
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

  randomMoveOrStop(animations: any) {
    this.state = [MoveState.MOVING, MoveState.STOPPED][Math.floor(Math.random() * 2)]
    if (this.state === MoveState.MOVING) {
      this.direction = randomDirection(this.direction)
    }
    this.playAnimsBasedOnDirection(animations)
  }

  playAnimsBasedOnDirection(animations: any) {
    const isMoving = this.state === MoveState.MOVING
    switch (this.direction) {
      case Direction.UP: {
        this.sprite.anims.play(isMoving ? animations.moveBack : animations.idleBack)
        break
      }
      case Direction.DOWN: {
        this.sprite.anims.play(isMoving ? animations.moveFront : animations.idleFront)
        break
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        this.sprite.anims.play(isMoving ? animations.moveSide : animations.idleSide)
        break
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
