import Game from '../scenes/Game'

export class Item {
  itemType: string = ''
  sprite!: Phaser.Physics.Arcade.Sprite
  scene: Game
  collider: Phaser.Physics.Arcade.Collider

  constructor(scene: Game, x: number, y: number, textureKey: string) {
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, textureKey)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.collider = this.scene.physics.add.collider(
      this.scene.player,
      this.sprite,
      this.onPlayerItemCollide,
      undefined,
      this
    )
  }

  onPlayerItemCollide() {
    this.scene.player.addItem(this)
    this.sprite.destroy()
  }

  drop(dropLength: number = 650) {
    // Launch coconut in random direction
    this.sprite.setName('InAir') // InAir tells depth sorting logic to ignore this sprite
    this.sprite.setGravityY(500)
    this.sprite.setDepth(100)
    const randLaunchAngle = Math.random() * -60 + -60
    this.scene.physics.velocityFromAngle(randLaunchAngle, 100, this.sprite.body.velocity)
    this.collider.active = false

    // After some time, stop the gravity and velocity to simulate it hitting the ground
    this.scene.time.delayedCall(dropLength, () => {
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
