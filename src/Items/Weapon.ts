import { Constants } from '~/utils/Constants'
import Player, { Direction } from '../characters/Player'

export class Weapon {
  private scene: Phaser.Scene
  private player: Player
  public sprite: Phaser.Physics.Arcade.Sprite
  private isAttacking: boolean = false

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene
    this.player = player
    this.sprite = this.scene.physics.add.sprite(player.x, player.y, '')
    this.sprite.setVisible(false)
    this.sprite.setOrigin(0.5)
    this.sprite.setAngle(30)
    this.sprite.setName('Weapon')
  }

  show(weaponType: string) {
    if (!this.isAttacking) {
      const handPosition = this.getPlayerHandPosition()
      const rotationAngle = this.getWeaponRotationAngle()
      const weaponDepth = this.getWeaponDepth()
      const scaleY = this.getWeaponScaleY()

      this.sprite.setX(handPosition.x)
      this.sprite.setY(handPosition.y)
      this.sprite.setTexture(weaponType)
      this.sprite.setVisible(true)
      this.sprite.setAngle(rotationAngle)
      this.sprite.setDepth(weaponDepth)
      this.sprite.scaleY = scaleY
    }
  }

  public tweenWeaponAttack() {
    if (!this.isAttacking) {
      const isLeft = this.player.direction === Direction.LEFT
      this.isAttacking = true
      this.sprite.setY(this.player.y + 5)
      this.sprite.setX(isLeft ? this.player.x - 10 : this.player.x + 10)
      this.sprite.setScale(1.25)
      this.sprite.setOrigin(0.5, 1)
      this.scene.tweens.add({
        targets: this.sprite,
        y: {
          from: this.player.y - 10,
          to: this.player.y + 10,
        },
        x: {
          from: isLeft ? this.player.x - 10 : this.player.x + 10,
          to: isLeft ? this.player.x - 20 : this.player.x + 20,
        },
        angle: {
          from: isLeft ? 20 : -20,
          to: isLeft ? -120 : 120,
        },
        duration: Constants.ATTACK_DURATION - 200,
        onComplete: () => {
          this.scene.time.delayedCall(100, () => {
            this.sprite.setScale(1)
            this.sprite.setOrigin(0.5)
            this.isAttacking = false
          })
        },
      })
    }
  }

  getWeaponDepth() {
    if (this.player.direction === Direction.UP) {
      return this.player.depth - 1
    }
    return this.player.depth + 1
  }

  getWeaponScaleY() {
    if (this.player.direction === Direction.LEFT) {
      return -1
    }
    return 1
  }

  getWeaponRotationAngle() {
    const currAnimFrame = this.player.anims.currentFrame
    switch (this.player.direction) {
      case Direction.RIGHT: {
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            return 120
          }
          case '3.png': {
            return 60
          }
          default:
            return 90
        }
      }
      case Direction.LEFT: {
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            return 60
          }
          case '3.png': {
            return 120
          }
          default:
            return 90
        }
      }
      default:
        return 30
    }
  }

  // Refactor this
  getPlayerHandPosition() {
    const currAnimFrame = this.player.anims.currentFrame
    switch (this.player.direction) {
      case Direction.UP: {
        switch (currAnimFrame.textureFrame) {
          case '20.png': {
            return { x: this.player.x + 15, y: this.player.y - 1 }
          }
          case '22.png': {
            return { x: this.player.x + 15, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x + 15, y: this.player.y }
        }
      }
      case Direction.DOWN: {
        switch (currAnimFrame.textureFrame) {
          case '6.png': {
            return { x: this.player.x + 15, y: this.player.y - 1 }
          }
          case '7.png': {
            return { x: this.player.x + 15, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x + 15, y: this.player.y }
        }
      }
      case Direction.RIGHT: {
        let xPos = this.player.x
        let yPos = this.player.y
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            xPos = this.player.x + 10
            yPos = this.player.y + 20
            break
          }
          case '3.png': {
            xPos = this.player.x + 20
            yPos = this.player.y + 10
            break
          }
          default:
            yPos = this.player.y + 15
            xPos = this.player.x + 15
        }
        return { x: xPos, y: yPos }
      }
      case Direction.LEFT: {
        let xPos = this.player.x
        let yPos = this.player.y
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            xPos = this.player.x - 10
            yPos = this.player.y + 20
            break
          }
          case '3.png': {
            xPos = this.player.x - 20
            yPos = this.player.y + 10
            break
          }
          default:
            xPos = this.player.x - 15
            yPos = this.player.y + 15
        }
        return { x: xPos, y: yPos }
      }
    }
  }
}