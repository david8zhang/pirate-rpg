# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

## Must haves for Alpha release:

- Bigger map with more islands and more tiles

- Lazy spawning / rendering

  1. Set an object pool of a fixed size for mobs, objects, harvestables, ships
  2. On each Update cycle:

     - remove items from the object pool that aren't visible in the current camera view

     - add items from the tilemap layer config which are in the current camera view

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
