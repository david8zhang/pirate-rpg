import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'

export class Projectile {
  private scene: Game
  private sprite: Phaser.Physics.Arcade.Sprite
  constructor(scene: Game, x: number, y: number, texture: string) {
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, texture)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
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
  }
}
