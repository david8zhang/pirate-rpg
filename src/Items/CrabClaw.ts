import Game from '../scenes/Game'
import { Item } from './Item'

export class CrabClaw extends Item {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'crabclaw')
    this.itemType = 'crab claw'
  }

  drop() {
    super.drop(300)
  }
}
