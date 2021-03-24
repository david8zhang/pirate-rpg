export enum MoveState {
  MOVING = 1,
  STOPPED = 2,
}

export interface MovementScript {
  state: MoveState
  update(): void
}
