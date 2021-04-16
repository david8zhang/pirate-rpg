import UIScene from '~/scenes/UIScene'
import Game from '../scenes/Game'

export class Item {
  itemType: string = ''
  sprite!: Phaser.Physics.Arcade.Sprite
  scene: Game
  collider: Phaser.Physics.Arcade.Collider
  dropLength?: number

  constructor(scene: Game, x: number, y: number, textureKey: string, dropLength?: number) {
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, textureKey)
    this.scene.physics.world.enable(this.sprite)
    this.sprite.body.onOverlap = true

    this.scene.physics.overlap(this.sprite, this.scene.player)
    this.collider = this.scene.physics.add.overlap(
      this.scene.player,
      this.sprite,
      this.onPlayerHoverItem,
      undefined,
      this
    )
    this.dropLength = dropLength
  }

  onPlayerHoverItem() {
    this.scene.pickupObjText.showText(
      this.itemType,
      this.scene.player.x - this.scene.player.width,
      this.scene.player.y + 20
    )
    this.scene.player.itemOnHover = this
  }

  drop() {
    // Launch coconut in random direction
    this.sprite.setName('InAir') // InAir tells depth sorting logic to ignore this sprite
    this.sprite.setGravityY(500)
    this.sprite.setDepth(100)
    const randLaunchAngle = Math.random() * -60 + -60
    this.scene.physics.velocityFromAngle(randLaunchAngle, 100, this.sprite.body.velocity)
    this.collider.active = false

    // After some time, stop the gravity and velocity to simulate it hitting the ground
    this.scene.time.delayedCall(this.dropLength || 650, () => {
      this.sprite.setGravity(0)
      this.sprite.setVelocity(0)

      // Do it agian for a "bounce" effect
      this.scene.physics.velocityFromAngle(-100, 30, this.sprite.body.velocity)
      this.sprite.setGravityY(500)
      this.scene.time.delayedCall(150, () => {
        this.sprite.setGravity(0)
        this.sprite.setVelocity(0)
        this.collider.active = true
        this.sprite.setName('')
      })
    })
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth)
  }
}
