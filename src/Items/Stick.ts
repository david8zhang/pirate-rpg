import Game from '../scenes/Game'
import { Item } from './Item'

export class Stick extends Item {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'stick')
    this.itemType = 'stick'
  }
}
