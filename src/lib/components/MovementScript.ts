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
  direction: Direction | null
  update(): void
  stop(): void
  start(): void
  destroy(): void
  handleTileCollision(go: any, obj: any, animations: any): void
}
