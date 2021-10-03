# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

- Crafting menu not updating when item is crafted and craftable items are updated

## Meatier Stuff

- Refactor the way structures work (have it load an entirely different scene)

## Must haves for Alpha release:

- Zoned map
  - transition between one map and another
- Effects
  - ship damage
  - ship explosion (death)

## Nice to Have Features (after Alpha release):

- Save harvestable state (if a harvestable has been harvested already, store that in player's save data)
- Armor (Head, Chest, Feet)
- Ranged weapons
- Make rowboats + tents have health
- Make structures removable
- Procedural Map generation
- Sails
  - Sails unfurling animations

## Technical Debt Roadmap:

- Extract components out of Transport class for reusability (Land detection, movement, etc.)
