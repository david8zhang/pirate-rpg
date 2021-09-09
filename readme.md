# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

## Must haves for Alpha release:

- Bigger map with more islands and more tiles

- Lazy spawning / rendering

  - Static mob pool with blank mob objects initialized at the beginning of the game
  - Mob spawners can only spawn mobs by "using" them from the Mob pool. If there are no more mobs available in the pool, grab a mob
    that is offscreen and recycle it. If no mobs are available, then don't spawn any mobs

- Sail boat
- More weapons
  - Stone sword
  - Cutlass
  - Dagger
- Effects
  - ship damage
  - ship explosion (death)

## Nice to Have Features (after Alpha release):

- Armor (Head, Chest, Feet)
- Ranged weapons
- Make rowboats + tents have health
- Make structures removable
- Procedural Map generation
- Sails
  - Sails unfurling animations

## Technical Debt Roadmap:

- Extract components out of Transport class for reusability (Land detection, movement, etc.)
