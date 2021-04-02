import { Mob } from '~/mobs/Mob'
import { AttackBehavior } from './AttackBehavior'

export class MeleeAttackBehavior extends AttackBehavior {
  private mob: Mob
  constructor(mob: Mob) {
    super()
    this.mob = mob
  }

  update() {}

  stop() {}

  start() {}

  destroy() {}
}
