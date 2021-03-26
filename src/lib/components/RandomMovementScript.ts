import { MovementScript, MoveState } from './MovementScript'

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

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

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    animations: {
      moveFront: string
      moveSide: string
      idleFront: string
      idleSide: string
    }
  ) {
    this.sprite = sprite
    this.scene = scene
    this.sprite.anims.play(animations.idleFront)

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

  update() {
    const speed = 50
    if (this.state === MoveState.MOVING) {
      switch (this.direction) {
        case Direction.UP: {
          this.sprite.setVelocity(0, -speed)
          break
        }
        case Direction.DOWN: {
          this.sprite.setVelocity(0, speed)
          break
        }
        case Direction.LEFT: {
          this.sprite.scaleX = -1
          this.sprite.setVelocity(-speed, 0)
          break
        }
        case Direction.RIGHT: {
          this.sprite.scaleX = 1
          this.sprite.setVelocity(speed, 0)
          break
        }
      }
    } else {
      this.sprite.setVelocity(0)
    }
  }
}
