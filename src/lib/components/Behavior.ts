export interface Behavior {
  update(): void
  stop(): void
  start(): void
  destroy(): void
}
