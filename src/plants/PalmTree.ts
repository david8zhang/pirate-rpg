import Phaser from 'phaser'
import Game from '~/scenes/Game'
import { Constants } from '../utils/Constants'
import { Coconut } from './Coconut'

export default class PalmTree extends Phaser.Physics.Arcade.Sprite {
  private static _FULL_HEALTH = 100
  public hasCoconuts: boolean = true
  public health: number = PalmTree._FULL_HEALTH
  public isBeingHit = false
  public droppedCoconuts: Coconut[] = []

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.body.setSize(this.width * 0.2, this.height * 0.1)
    this.body.offset.y = 57
    this.setPushable(false)
  }

  takeDamage(damage: number) {
    if (this.health === PalmTree._FULL_HEALTH) {
      this.hasCoconuts = false
      this.setFrame(0)
      this.dropCoconuts()
    }
    this.health -= damage
    this.health = Math.max(0, this.health)
    this.scene.cameras.main.shake(Constants.ATTACK_DURATION / 2, 0.002)
  }

  dropCoconuts() {
    this.droppedCoconuts.push(
      new Coconut(this.scene as Game, this.x, this.y + this.height / 2 + 10)
    )
  }
}
