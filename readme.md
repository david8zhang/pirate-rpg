# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

- Some hitboxes when hitting multiple enemies is not being deleted

## Easy wins

- Add new resource type: Iron, which drops from boulders
- Add "proximity items", like sticks that spawn near trees or rocks that spawn near boulders
- Make tools that can be crafted from sticks / wood

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
