# Avast!

A top down pirate themed survival/crafting game build using Phaser 3

## Bugs to fix

## Easy wins

- Make monkeys have drops, like pelts and bananas or something
- Give crab claws a function, like making them edible
- Add fish and sharks that swim around in the ocean

## Meatier Stuff

- Add a "circle gradient" to create self-contained maps
  - Once this is done, remove the map transition logic
  - Make the perlin map generation produce a giant (1000 x 1000) map and then chunk it for performance optimization
- Add "medium" ship between Brig and Sailboat
- Add "navy" ships which spawn in the ocean and randomly roam around and can be boarded and comandeered
  - Add navy sailors and captains
- Add animated flags to ships
- Add the ability to damage boats and ships with melee weapons (eventually breaking them back down into component parts)
- Make certain enemies automatically aggro the player

# Long Term stuff

- Add biomes
- Add NPCs and dialogue
- Add leveling / EXP system for different attributes

## Technical Debt Roadmap:

- Use central key input listener
