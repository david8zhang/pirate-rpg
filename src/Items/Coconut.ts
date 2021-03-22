import Game from '../scenes/Game'
import { Item } from './Item'

export class Coconut extends Item {
  private scene: Game
  private collider: Phaser.Physics.Arcade.Collider
  constructor(scene: Game, x: number, y: number) {
    super()
    this.itemType = 'Coconut'
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, 'coconut')
    // this.sprite.setPushable(false)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.collider = this.scene.physics.add.collider(
      this.scene.player,
      this.sprite,
      this.onPlayerCoconutCollide,
      undefined,
      this
    )
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
    this.scene.time.delayedCall(650, () => {
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

  onPlayerCoconutCollide() {
    this.scene.player.addItem(this)
    this.sprite.destroy()
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth)
  }
}
