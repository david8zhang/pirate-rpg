import { ShipHealthBar } from '../ui/ShipHealthBar'

export class ShipUIScene extends Phaser.Scene {
  private static _instance: ShipUIScene
  public shipHealthBar!: ShipHealthBar
  constructor() {
    super('ship-ui')
    ShipUIScene._instance = this
  }

  preload() {
    this.shipHealthBar = new ShipHealthBar(this)
  }

  hide() {
    this.scene.setVisible(false)
  }

  show() {
    this.scene.setVisible(true)
  }

  public static get instance() {
    return ShipUIScene._instance
  }
}
