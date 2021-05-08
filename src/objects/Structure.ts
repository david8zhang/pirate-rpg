import Game from '~/scenes/Game'

export class Structure {
  public sprite: Phaser.Physics.Arcade.Image
  private scene: Game
  private isEnterable: boolean = false

  constructor(scene: Game, texture: string, x: number, y: number) {
    this.scene = scene
    this.sprite = this.scene.physics.add.image(x, y, texture)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.setSize(this.sprite.width * 0.5, this.sprite.height * 0.5)
    this.sprite.body.offset.y = this.sprite.height - 20
    this.scene.physics.add.overlap(this.sprite, this.scene.player, () => {
      if (scene.player.getCurrState() !== 'attack') {
        this.isEnterable = true
        this.scene.player.setStructureToEnter(this)
      }
    })
  }

  enterStructure() {
    this.scene.hideAllLayers()
  }
}
