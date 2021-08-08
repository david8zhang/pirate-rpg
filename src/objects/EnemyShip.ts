import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'
import { ShipConfig } from './Ship'

export class EnemyShip {
  private scene: Game
  public isSailing: boolean = false
  public currDirection = Direction.UP
  public hullSprite!: Phaser.Physics.Arcade.Sprite
  public wheelSprite!: Phaser.Physics.Arcade.Sprite
  public ladderSprite!: Phaser.Physics.Arcade.Sprite
  public sailsSprite!: Phaser.Physics.Arcade.Sprite
  public hitboxImages: Phaser.Physics.Arcade.Image[] = []
  public colliders: Phaser.Physics.Arcade.Collider[] = []

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    this.scene = scene
    const { hullImages, sailsImages, hullBodyConfig } = shipConfig
    const { x, y } = position
    this.setupSprites(x, y, hullImages, sailsImages)
    this.setupHitboxes(hullBodyConfig)
  }

  setupSprites(x: number, y: number, hullImages: any, sailsImages: any) {
    const direction =
      this.currDirection === Direction.LEFT || this.currDirection === Direction.RIGHT
        ? 'side'
        : this.currDirection
    const hullImage = hullImages[direction]
    const sailsImage = sailsImages[direction]
    this.hullSprite = this.scene.physics.add.sprite(x, y, hullImage)
    this.sailsSprite = this.scene.physics.add.sprite(x, y, sailsImage)
    this.hullSprite.setName('Transport')
    this.hullSprite.setDepth(this.scene.player.depth - 1)
    this.hullSprite.setData('ref', this)

    this.hullSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1
    this.sailsSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1
    this.sailsSprite.setSize(1, 1)
    this.sailsSprite.setAlpha(0.5)
  }

  setupHitboxes(hullBodyConfig: any) {
    this.scene.physics.world.enableBody(this.hullSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    const config = hullBodyConfig[this.currDirection]
    this.hullSprite.body.setSize(
      this.hullSprite.width * config.width,
      this.hullSprite.height * config.height
    )
    this.hullSprite.body.offset.y = this.hullSprite.height * config.yOffset
    this.hullSprite.body.offset.x = this.hullSprite.width * config.xOffset
    const playerCollider = this.scene.physics.add.collider(this.hullSprite, this.scene.player)
    this.hullSprite.setPushable(false)
    this.colliders.push(playerCollider)
  }
}
