import Game from '../scenes/Game'
import { Item } from './Item'

export class Rock extends Item {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'rock')
    this.itemType = 'rock'
  }
}
