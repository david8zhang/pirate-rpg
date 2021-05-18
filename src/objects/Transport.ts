import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'
import { ItemConfig } from './ItemConfig'

export class Transport {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Image
  public triggerImage: Phaser.Physics.Arcade.Image
  public landDetector: Phaser.Physics.Arcade.Image

  public transportObjGroup: Phaser.GameObjects.Group
  public itemRef: ItemConfig
  public currDirection: Direction | null = null
  public isExitable: boolean = false

  constructor(scene: Game, itemRef: ItemConfig, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.physics.add.image(x, y, itemRef.inWorldImageSet.side as string)
    this.itemRef = itemRef
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setName('Transport')
    this.sprite.setDepth(this.scene.player.depth - 1)

    // trigger image which detects when player is in range of entering this transport
    this.triggerImage = this.scene.physics.add.image(x, y, '').setVisible(false)
    this.scene.physics.world.enableBody(this.triggerImage, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.triggerImage.body.setSize(this.sprite.width * 2, this.sprite.height * 2)
    this.scene.physics.add.overlap(this.triggerImage, this.scene.player, () => {
      this.scene.player.enterableTransport = this
      this.scene.hoverText.showText(
        '(E) Enter ' + this.itemRef.name,
        this.scene.player.x - this.scene.player.width,
        this.scene.player.y + this.scene.player.height / 2 + 10
      )
    })

    // Land detection collider to determine when player can disembark
    this.landDetector = this.scene.physics.add
      .image(x + this.sprite.width / 2, y, '')
      .setVisible(false)
    this.scene.physics.world.enableBody(this.landDetector, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.landDetector.body.setSize(20, 20)

    this.transportObjGroup = this.scene.add.group()
    this.transportObjGroup.add(this.sprite)
  }

  enterTransport() {
    this.scene.hoverText.hide()
    this.scene.player.x = this.sprite.x
    this.scene.player.y = this.sprite.y - 15
    this.scene.player.isInsideTransport = true
    this.scene.player.currTransport = this
    const weapon = this.scene.player.getWeapon()
    if (weapon) {
      weapon.isEquipped = false
      weapon.hide()
    }
    this.transportObjGroup.add(this.scene.player)
    this.scene.playerOceanCollider.active = false
    this.scene.hoverText.hide()
  }

  exitTransport() {
    if (this.isExitable) {
      this.sprite.setVelocity(0, 0)
      this.triggerImage.setPosition(this.sprite.x, this.sprite.y)
      this.scene.player.x = this.landDetector.x
      this.scene.player.y = this.landDetector.y
      this.scene.player.currTransport = null
      this.transportObjGroup.remove(this.scene.player)
      this.scene.playerOceanCollider.active = true
      this.isExitable = false
      this.scene.hoverText.hide()
    }
  }

  update() {
    this.sprite.setDepth(this.scene.player.depth - 1)
    this.handleLandDetector()
    this.handleMovement(this.scene.cursors)
  }

  handleLandDetector() {
    let xOffset = 0
    let yOffset = 0
    switch (this.currDirection) {
      case Direction.LEFT:
        xOffset = -(this.sprite.width / 2 + 10)
        yOffset = 0
        break
      case Direction.RIGHT:
        xOffset = this.sprite.width / 2 + 10
        yOffset = 0
        break
      case Direction.UP:
        xOffset = 0
        yOffset = -(this.sprite.height / 2 + 10)
        break
      case Direction.DOWN:
        xOffset = 0
        yOffset = this.sprite.height / 2 + 10
        break
    }
    this.landDetector.setPosition(this.sprite.x + xOffset, this.sprite.y + yOffset)
    let isExitable = false
    this.scene.getAllTileLayers().forEach((tileMap) => {
      const check = tileMap.getTileAtWorldXY(this.landDetector.x, this.landDetector.y)
      if (check && check.layer.name !== 'Ocean') {
        isExitable = true
      }
    })
    if (this.isExitable) {
      this.scene.hoverText.showText(
        '(E) Exit ' + this.itemRef.name,
        this.scene.player.x - this.scene.player.width,
        this.scene.player.y - this.scene.player.height / 2 - 10
      )
    } else {
      this.scene.hoverText.hide()
    }
    this.isExitable = isExitable
  }

  handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const player = this.scene.player
    const speed = this.isExitable ? 0 : 150

    if (!(leftDown || rightDown || upDown || downDown)) {
      this.sprite.setVelocity(0, 0)
      player.setVelocity(0, 0)
      return
    }

    if (leftDown) {
      // Set the player's scale and body colliders
      player.scaleX = -1
      player.body.offset.x = 27
      player.direction = Direction.LEFT
      player.setVelocity(-speed, 0)

      // Set the ship's scale and body colliders
      this.sprite.body.setSize(this.sprite.width, this.sprite.height)
      this.sprite.setTexture(this.itemRef.inWorldImageSet.side)
      this.sprite.scaleX = -1
      this.sprite.body.offset.x = this.sprite.width
      this.sprite.setVelocity(-speed, 0)
      this.currDirection = Direction.LEFT
    }
    if (rightDown) {
      player.scaleX = 1
      player.body.offset.x = 12
      player.direction = Direction.RIGHT
      player.setVelocity(speed, 0)

      this.sprite.setTexture(this.itemRef.inWorldImageSet.side)
      this.sprite.body.setSize(this.sprite.width, this.sprite.height)
      this.sprite.scaleX = 1
      this.sprite.body.offset.x = 0
      this.sprite.setVelocity(speed, 0)
      this.currDirection = Direction.RIGHT
    }
    if (upDown) {
      player.setVelocity(0, -speed)
      player.direction = Direction.UP

      this.sprite.scaleX = 1
      this.sprite.body.offset.x = 0
      this.sprite.setTexture(this.itemRef.inWorldImageSet.up)
      this.sprite.body.setSize(this.sprite.width, this.sprite.height)
      this.sprite.setVelocity(0, -speed)
      this.currDirection = Direction.UP
    }
    if (downDown) {
      player.direction = Direction.DOWN
      player.setVelocity(0, speed)

      this.sprite.scaleX = 1
      this.sprite.body.offset.x = 0
      this.sprite.setTexture(this.itemRef.inWorldImageSet.down)
      this.sprite.body.setSize(this.sprite.width, this.sprite.height)
      this.sprite.setVelocity(0, speed)
      this.currDirection = Direction.DOWN
    }
    player.anims.play(`player-idle-${player.getAnimDirection(player.direction)}`, true)
  }
}
