import { Direction } from '~/characters/Player'
import { Mob } from '~/mobs/Mob'
import { AnimationType } from '~/utils/Constants'
import Game from '../scenes/Game'
import { Ship, ShipConfig } from './Ship'

export class EnemyShip extends Ship {
  public mobInControl: Mob | null = null
  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    super(scene, shipConfig, position)
  }

  setMobInControl(mobInControl: Mob) {
    this.mobInControl = mobInControl
    this.mobInControl.sprite.body.enable = false
    this.mobInControl.sprite.body.debugShowBody = false
    this.positionMobAtWheel()
  }

  stop() {
    super.stop()
    if (this.wallImages.length === 0) {
      this.setupWalls(this.shipConfig.colliderConfig)
    }
  }

  onPlayerLadderCollide() {
    return
  }

  moveShip(direction: Direction) {
    this.destroyAllColliders()
    super.moveShip(direction)
    this.positionMobAtWheel()
  }

  positionMobAtWheel() {
    const distanceFromWheel = 20
    if (this.mobInControl) {
      switch (this.currDirection) {
        case Direction.UP:
          this.mobInControl.sprite.x = this.wheelSprite.x
          this.mobInControl.sprite.y = this.wheelSprite.y + distanceFromWheel
          break
        case Direction.DOWN:
          this.mobInControl.sprite.x = this.wheelSprite.x
          this.mobInControl.sprite.y = this.wheelSprite.y - distanceFromWheel
          break
        case Direction.LEFT:
          this.mobInControl.sprite.scaleX = 1
          this.mobInControl.sprite.x = this.wheelSprite.x + distanceFromWheel
          this.mobInControl.sprite.y = this.wheelSprite.y
          break
        case Direction.RIGHT:
          this.mobInControl.sprite.scaleX = -1
          this.mobInControl.sprite.x = this.wheelSprite.x - distanceFromWheel
          this.mobInControl.sprite.y = this.wheelSprite.y
          break
      }
      this.playMobAnimation()
    }
  }

  playMobAnimation() {
    if (this.mobInControl) {
      const sideAnim = this.mobInControl.animations[AnimationType.IDLE_SIDE]
      const upAnim = this.mobInControl.animations[AnimationType.IDLE_BACK]
      const downAnim = this.mobInControl.animations[AnimationType.IDLE_FRONT]
      switch (this.currDirection) {
        case Direction.LEFT:
        case Direction.RIGHT:
          if (this.mobInControl.sprite.anims.getName() !== sideAnim)
            this.mobInControl.sprite.anims.play(sideAnim)
          break
        case Direction.DOWN:
          if (this.mobInControl.sprite.anims.getName() !== downAnim)
            this.mobInControl.sprite.anims.play(downAnim)
          break
        case Direction.UP:
          if (this.mobInControl.sprite.anims.getName() !== upAnim)
            this.mobInControl.sprite.anims.play(upAnim)
          break
      }
    }
  }
}
