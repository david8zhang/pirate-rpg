# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

## Easy wins

- Save map seed when player does "save and quit"

## Meatier Stuff

- Procedurally place plants and animals based on land masses
- Handle perlin map offset when player collides with world bounds

## Must haves for Alpha release:

### Zoned Map

- transition between one map and another when player hits the boundary. Depending on which boundary side is hit, player goes to different map (so different map in each of the 4 cardinal directions)
- Overworld config which describes which maps go to which other maps
- Save state of player in overworld

### Better Ships

- Spawn pirate ships with crews
- single sail two-cannon craft (sloop)

### More game content

- Banana trees
- Monkey pelts, monkey meat
- Crab meat
- Skeleton pirates, with skeletal ships. More skeleton types (Captain, Sailor)
- Human navy ships with normal ships. Different sailor types (Captain, Sailor)

### Effects

- ship damage: holes, small fires, singed areas
- ship explosion and sinking animation

## Nice to Have Features (after Alpha release):

- Save harvestable state (if a harvestable has been harvested already, store that in player's save data)
- Armor (Head, Chest, Feet)
- Ranged weapons
- Make rowboats + tents have health
- Reworked structures
  - Make structures removable
- Procedural Map generation
- Sails
  - Sails unfurling animations

## Technical Debt Roadmap:

- Extract components out of Transport class for reusability (Land detection, movement, etc.)
