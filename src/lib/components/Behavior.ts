export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Behavior {
  direction?: Direction | null
  name?: string
  handleTileCollision(obj1: any, obj2: any, animations: any): void
  update(): void
  stop(): void
  start(): void
  destroy(): void
  disable(): void
}
