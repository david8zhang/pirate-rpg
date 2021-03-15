import Phaser from 'phaser'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, texture: string, frame?: string | number): Player
    }
  }
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture)
    this.anims.play('player-idle-down')
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors || !this) {
      return
    }

    const speed = 100
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    if (leftDown) {
      this.anims.play('player-run-side', true)
      this.scaleX = -1
      this.body.offset.x = 30
      this.setVelocity(-speed, 0)
    } else if (rightDown) {
      this.anims.play('player-run-side', true)
      this.scaleX = 1
      this.body.offset.x = 10
      this.setVelocity(speed, 0)
    } else if (upDown) {
      this.anims.play('player-run-up', true)
      this.setVelocity(0, -speed)
    } else if (downDown) {
      this.anims.play('player-run-down', true)
      this.setVelocity(0, speed)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      this.anims.play(`player-idle-${parts[2]}`, true)
      this.setVelocity(0, 0)
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'player',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame)
    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.4)
    sprite.body.offset.y = 22
    return sprite
  }
)
