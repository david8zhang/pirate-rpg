import Phaser from 'phaser'
import { AttackState } from '~/lib/states/AttackState'
import { IdleState } from '~/lib/states/IdleState'
import { MoveState } from '~/lib/states/MoveState'
import Game from '../scenes/Game'
import { StateMachine } from '../lib/StateMachine'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, texture: string, frame?: string | number): Player
    }
  }
}

export enum Direction {
  DOWN = 'down',
  UP = 'up',
  LEFT = 'left',
  RIGHT = 'right',
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public stateMachine: StateMachine
  public direction: Direction = Direction.DOWN
  public inventory: any[] = []

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture)
    this.anims.play('player-idle-down')
    this.stateMachine = new StateMachine(
      'idle',
      {
        idle: new IdleState(),
        attack: new AttackState(),
        move: new MoveState(),
      },
      [(scene as Game).cursors, this]
    )
  }

  getCurrState(): string {
    return this.stateMachine.getState()
  }

  update() {
    this.stateMachine.step()
  }

  addItem(item: any) {
    this.inventory.push(item)
  }

  getAnimDirection(dir: Direction) {
    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      return 'side'
    }
    return dir
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'player',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame)
    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    sprite.body.setSize(sprite.width * 0.4, sprite.height * 0.4)
    sprite.body.offset.y = 22
    return sprite
  }
)
