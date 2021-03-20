import Game from '../scenes/Game'
import { Item } from './Item'

export class Coconut extends Item {
  private scene: Game
  constructor(scene: Game, x: number, y: number) {
    super()
    this.itemType = 'Coconut'
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(x, y, 'coconut')
    this.sprite.setPushable(false)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.scene.physics.add.collider(
      this.scene.player,
      this.sprite,
      this.onPlayerCoconutCollide,
      undefined,
      this
    )
  }

  drop(startPos: { x: number; y: number }, endPos: { x: number; y: number }) {
    const yDiff = endPos.y - startPos.y
    this.sprite.setName('InAir')
    this.sprite.depth = 10000
    this.scene.tweens.add({
      targets: this.sprite,
      ease: 'Bounce.easeOut',
      duration: 700,
      y: `+=${yDiff}`,
      onComplete: () => {
        this.sprite.body.enable = true
        this.sprite.setName('')
        this.isOnGround = true
      },
    })
  }

  onPlayerCoconutCollide() {
    if (this.sprite.name !== 'InAir') {
      this.scene.player.addItem(this)
      this.sprite.destroy()
    }
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth)
  }
}
