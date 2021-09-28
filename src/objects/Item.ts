import { Constants } from '~/utils/Constants'
import Game from '../scenes/Game'

export class Item {
  itemName: string = ''
  sprite!: Phaser.Physics.Arcade.Sprite
  scene: Game
  dropLength?: number
  disableHover?: boolean
  texture: string

  constructor(
    scene: Game,
    x: number,
    y: number,
    textureKey: string,
    dropLength?: number,
    disableHover?: boolean
  ) {
    this.texture = textureKey
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, textureKey)
    this.scene.physics.world.enable(this.sprite)
    this.sprite.body.onOverlap = true
    this.sprite.setData('ref', this)
    this.dropLength = dropLength
    this.disableHover = disableHover
  }

  onPlayerHoverItem() {
    if (!this.disableHover) {
      this.scene.hoverText.showText(
        `(E) Pick up ${this.itemName}`,
        this.scene.player.x - this.scene.player.width,
        this.scene.player.y + 20
      )
      this.scene.player.itemOnHover = this
    }
  }

  destroy() {
    this.sprite.destroy()
  }

  drop(launchVelocity?: number) {
    // Launch coconut in random direction
    this.sprite.setName('InAir') // InAir tells depth sorting logic to ignore this sprite
    this.sprite.setGravityY(500)
    this.sprite.setDepth(10000)
    const randLaunchAngle = Math.random() * -60 + -60
    this.scene.physics.velocityFromAngle(
      randLaunchAngle,
      launchVelocity || 100,
      this.sprite.body.velocity
    )

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
        this.sprite.setName('')
        this.scene.dropItem(this)
      })
    })
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth)
  }

  changeConfig(itemType: string, x: number, y: number) {
    const newItem = Constants.getItem(itemType)
    if (newItem) {
      try {
        this.sprite.setTexture(newItem.image)
        this.dropLength = newItem.stats && newItem.stats.dropLength ? newItem.stats.dropLength : 650
        this.itemName = newItem.name
        this.sprite.x = x
        this.sprite.y = y
      } catch (err) {
        console.log(err)
      }
    }
  }
}
