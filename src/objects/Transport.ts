import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'
import { ItemConfig } from './ItemConfig'

export class Transport {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Image
  public triggerImage: Phaser.Physics.Arcade.Image

  public transportObjGroup: Phaser.GameObjects.Group

  constructor(scene: Game, itemRef: ItemConfig, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.physics.add.image(x, y, itemRef.inWorldImage as string)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setName('Transport')
    this.sprite.setDepth(this.scene.player.depth - 1)

    // trigger image which detects when player is in range of entering this transport
    this.triggerImage = this.scene.physics.add.image(x, y, '').setVisible(false)
    this.scene.physics.world.enableBody(this.triggerImage, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.triggerImage.body.setSize(this.sprite.width * 2, this.sprite.height * 2)
    this.scene.physics.add.overlap(this.triggerImage, this.scene.player, () => {
      this.scene.player.enterableTransport = this
    })
    this.transportObjGroup = this.scene.add.group()
    this.transportObjGroup.add(this.sprite)
  }

  enterTransport() {
    this.scene.hoverText.hide()
    this.scene.player.x = this.sprite.x
    this.scene.player.y = this.sprite.y - 15
    this.scene.player.isInsideTransport = true
    this.scene.player.currTransport = this
    this.transportObjGroup.add(this.scene.player)
    this.scene.playerOceanCollider.active = false
  }

  update() {
    this.sprite.setDepth(this.scene.player.depth - 1)
    this.handleMovement(this.scene.cursors)
  }

  handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const player = this.scene.player
    const speed = 100

    if (!(leftDown || rightDown || upDown || downDown)) {
      this.sprite.setVelocity(0, 0)
      player.setVelocity(0, 0)
      return
    }

    if (leftDown) {
      this.sprite.setTexture('rowboat')
      player.scaleX = -1
      player.body.offset.x = 27
      player.direction = Direction.LEFT
      this.sprite.scaleX = -1
      player.setVelocity(-speed, 0)
      this.sprite.setVelocity(-speed, 0)
    }
    if (rightDown) {
      this.sprite.setTexture('rowboat')
      player.scaleX = 1
      player.body.offset.x = 12
      this.sprite.scaleX = 1
      player.direction = Direction.RIGHT
      player.setVelocity(speed, 0)
      this.sprite.setVelocity(speed, 0)
    }
    if (upDown) {
      this.sprite.setTexture('rowboat-up')
      player.setVelocity(0, -speed)
      this.sprite.setVelocity(0, -speed)
      player.direction = Direction.UP
    }
    if (downDown) {
      this.sprite.setTexture('rowboat-down')
      player.direction = Direction.DOWN
      player.setVelocity(0, speed)
      this.sprite.setVelocity(0, speed)
    }
    player.anims.play(`player-idle-${player.getAnimDirection(player.direction)}`, true)
  }
}
