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

export interface MovementScript {
  state: MoveState
  direction: Direction
  update(): void
  stop(): void
  start(): void
  destroy(): void
}
