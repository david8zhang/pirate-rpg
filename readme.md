# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

## Easy wins

- Figure out how to offset the initial spawn position of ships after map transition based on ship's height/width

## Meatier Stuff

- Handle world bound collisions when player is in a ship or in a transport
- Stop enemy ship when player attempts to board
- Refactor the way structures work (have it load an entirely different scene)

## Must haves for Alpha release:

### Zoned Map

- transition between one map and another when player hits the boundary. Depending on which boundary side is hit, player goes to different map (so different map in each of the 4 cardinal directions)
- Overworld config which describes which maps go to which other maps
- Save state of player in overworld

### Better Ships

- Spawn pirate ships with crews
- Allow player to board enemy ships that are moving. When ship is moving and player tries to board, enemy ship stops and allows player to fight crew to take over the ship

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
- Make structures removable
- Procedural Map generation
- Sails
  - Sails unfurling animations

## Technical Debt Roadmap:

- Extract components out of Transport class for reusability (Land detection, movement, etc.)
