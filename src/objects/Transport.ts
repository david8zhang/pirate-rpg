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
    this.scene.player.y = this.sprite.y
    this.scene.player.isInsideTransport = true
    this.scene.player.currTransport = this
    this.transportObjGroup.add(this.scene.player)
  }
}
