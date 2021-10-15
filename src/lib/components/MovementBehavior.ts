import { Behavior, Direction } from './Behavior'

export enum MoveState {
  MOVING = 1,
  STOPPED = 2,
}

export class MovementBehavior implements Behavior {
  public direction: Direction | null = null
  public moveEvent!: Phaser.Time.TimerEvent
  public state: MoveState = MoveState.MOVING
  public ignoreTileCollision = false
  public speed: number = 50
  public onMove: Function = () => {}
  public name: string = 'MOVE'

  constructor() {}

  update() {}
  start() {}
  stop() {}
  destroy() {}
  disable() {}
  handleTileCollision(obj1: any, obj2: any, animations: any) {}
}
