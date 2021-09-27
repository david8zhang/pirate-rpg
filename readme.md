# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

- Weapon hitboxes when hitting multiple enemies is not being deleted

## Easy wins

- exclude slash effect animation from depth sorting
- change particle type for when boulders are hit
- add new resource type for boulder

## Must haves for Alpha release:

- Bigger map with more islands and more tiles
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
