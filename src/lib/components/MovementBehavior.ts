import { Behavior } from './Behavior'

export enum MoveState {
  MOVING = 1,
  STOPPED = 2,
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export class MovementBehavior implements Behavior {
  public direction: Direction | null = null
  public moveEvent!: Phaser.Time.TimerEvent
  public state: MoveState = MoveState.MOVING
  public speed: number = 50
  public onMove: Function = () => {}

  constructor() {}

  update() {}
  start() {}
  stop() {}
  destroy() {}
  handleTileCollision(obj1: any, obj2: any, animations: any) {}
}
