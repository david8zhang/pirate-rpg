declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      giantCrab(x: number, y: number, texture: string, frame?: string | number): GiantCrab
    }
  }
}

export class GiantCrab extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture)
    this.anims.play('crab-idle')
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'giantCrab',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new GiantCrab(this.scene, x, y, texture, frame)
    this.displayList.add(sprite)
    this.updateList.add(sprite)
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    return sprite
  }
)
