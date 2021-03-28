import Game from '../scenes/Game'
import { Item } from './Item'

export class CrabClaw extends Item {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'crabclaw')
    this.itemType = 'CrabClaw'
  }

  drop() {
    super.drop(300)
  }
}
