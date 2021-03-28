import Game from '../scenes/Game'
import { Item } from './Item'

export class Coconut extends Item {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'coconut')
    this.itemType = 'Coconut'
  }
}
