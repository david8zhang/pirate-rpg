import Game from '~/scenes/Game'

export class Structure {
  public sprite: Phaser.Physics.Arcade.Image
  private scene: Game
  public boundsImage: Phaser.Physics.Arcade.Image
  public texture: string

  constructor(scene: Game, texture: string, x: number, y: number) {
    this.scene = scene
    this.texture = texture
    this.sprite = this.scene.physics.add.image(x, y, texture)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.setSize(this.sprite.width * 0.5, this.sprite.height * 0.5)
    this.sprite.body.offset.y = this.sprite.height - 20
    this.scene.physics.add.overlap(this.sprite, this.scene.player, () => {
      if (scene.player.getCurrState() !== 'attack') {
        this.scene.player.setStructureToEnter(this)
        this.scene.hoverText.showText(
          '(E) Enter',
          this.scene.player.x - this.scene.player.width / 2,
          this.scene.player.y - 10
        )
      }
    })
    this.sprite.setData('ref', this)

    // Create a boundary so player/mobs can't walk into the tent
    this.boundsImage = this.scene.physics.add.image(x, y, '').setVisible(false)
    this.scene.physics.world.enableBody(this.boundsImage, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.scene.physics.add.collider(this.boundsImage, this.scene.player, () => {})
    this.scene.physics.add.collider(this.boundsImage, this.scene.mobs, () => {})
    this.boundsImage.body.setSize(this.sprite.width, this.sprite.height * 0.6)
    this.boundsImage.body.offset.y = 10
    this.boundsImage.setPushable(false)
  }

  exitStructure() {
    this.boundsImage.body.enable = true
    this.sprite.setVisible(false)
  }

  enterStructure() {
    // TODO: Refactor entering structures
  }
}
