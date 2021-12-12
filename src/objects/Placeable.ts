import { Constants } from '~/utils/Constants'
import { Direction } from '../characters/Player'
import Game from '../scenes/Game'
import { ItemConfig } from './ItemConfig'
import { Ship } from './Ship'

export enum PlaceableType {
  structure = 'Structure',
  ship = 'Ship',
}

export class Placeable {
  private scene: Game
  private itemRef: ItemConfig
  private previewSprite!: Phaser.Physics.Arcade.Image
  public isShowingPreview: boolean = false

  // Collisions with different tile layers
  public colliders: Phaser.Physics.Arcade.Collider[] = []
  public nonCollidableLayers: string[] = []

  constructor(scene: Game, item: ItemConfig, nonCollidableLayers?: string[]) {
    this.scene = scene
    this.itemRef = item
    if (nonCollidableLayers) {
      this.nonCollidableLayers = nonCollidableLayers
    }
  }

  setShowPreview(showPreview: boolean) {
    this.isShowingPreview = showPreview
  }

  placeItem(type: PlaceableType): boolean {
    const isWithinValidBounds = this.getWithinValidBounds()
    if (!this.previewSprite.body.embedded && isWithinValidBounds) {
      this.scene.player.removeItem(this.itemRef.name, 1)
      this.isShowingPreview = false

      // Add the object to the game's game object groups
      if (type === PlaceableType.structure) {
        this.scene.addStructure(
          this.itemRef.inWorldImage as string,
          this.previewSprite.x,
          this.previewSprite.y
        )
      }

      if (type === PlaceableType.ship) {
        const shipConfig = Constants.getShip(this.itemRef.name)
        if (shipConfig) {
          this.scene.addShip(
            new Ship(this.scene, shipConfig, { x: this.previewSprite.x, y: this.previewSprite.y })
          )
        }
      }

      this.colliders.forEach((collider) => {
        collider.destroy()
      })
      this.previewSprite.destroy()
      return true
    }
    return false
  }

  getWithinValidBounds() {
    let isWithinValidBounds = false
    this.scene.getAllTileLayers().forEach((tileMap) => {
      if (this.nonCollidableLayers.includes(tileMap.layer.name)) {
        const check = tileMap.getTileAtWorldXY(this.previewSprite.x, this.previewSprite.y)
        if (check) {
          isWithinValidBounds = true
        }
      }
    })
    return isWithinValidBounds
  }

  destroy() {
    this.previewSprite.destroy()
    this.colliders.forEach((collider) => {
      collider.destroy()
    })
  }

  showPreview() {
    if (this.isShowingPreview) {
      const { player } = this.scene
      if (!this.previewSprite) {
        this.previewSprite = this.scene.physics.add
          .image(player.x, player.y, this.itemRef.inWorldImage as string)
          .setAlpha(0.5)

        this.scene.physics.world.enableBody(this.previewSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

        this.scene.getAllObjectGroups().forEach((group) => {
          if (group) {
            this.colliders.push(this.scene.physics.add.overlap(group, this.previewSprite))
          }
        })
      }
      let xPos = player.x
      let yPos = player.y
      switch (player.direction) {
        case Direction.LEFT:
          xPos = player.x - (this.previewSprite.width / 2 + 10)
          yPos = player.y
          break
        case Direction.RIGHT:
          xPos = player.x + (this.previewSprite.width / 2 + 10)
          yPos = player.y
          break
        case Direction.UP:
          yPos = player.y - (this.previewSprite.height / 2 + 10)
          xPos = player.x
          break
        case Direction.DOWN:
          yPos = player.y + (this.previewSprite.height / 2 + 10)
          xPos = player.x
          break
      }
      if (this.previewSprite.body.embedded || !this.getWithinValidBounds()) {
        this.previewSprite.setTint(0xff0000)
      } else {
        this.previewSprite.setTint(0xffffff)
      }
      this.previewSprite.x = xPos
      this.previewSprite.y = yPos
    }
  }
}
