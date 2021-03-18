import Game from '../scenes/Game'

export class Coconut {
  private scene: Game
  public sprite: Phaser.GameObjects.Sprite
  constructor(scene: Game, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.add.sprite(x, y, 'coconut')
    this.sprite.setDepth(scene.player.depth + 1)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth)
  }
}
