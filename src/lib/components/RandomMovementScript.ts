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
  public moveAnimKey!: string
  public stopAnimKey!: string

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    animations: {
      move: string
      idle: string
    }
  ) {
    this.sprite = sprite
    this.scene = scene
    this.sprite.body.onCollide = true
    this.sprite.anims.play(animations.idle)
    this.moveEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.randomMoveOrStop(animations)
      },
      loop: true,
    })
  }

  randomMoveOrStop(animations: { move: string; idle: string }) {
    this.state = [MoveState.MOVING, MoveState.STOPPED][Math.floor(Math.random() * 2)]
    if (this.state === MoveState.MOVING) {
      console.log('moving!')
      this.sprite.anims.play(animations.move)
      this.direction = randomDirection(this.direction)
    } else {
      console.log('stopped!')
      this.sprite.anims.play(animations.idle)
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
          this.sprite.setVelocity(-speed, 0)
          break
        }
        case Direction.RIGHT: {
          this.sprite.setVelocity(speed, 0)
          break
        }
      }
    } else {
      this.sprite.setVelocity(0)
    }
  }
}
