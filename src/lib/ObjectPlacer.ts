import { Mob } from '~/mobs/Mob'
import { EnemyShip } from '~/objects/EnemyShip'
import { shuffle } from 'lodash'
import Game from '~/scenes/Game'
import { Constants, CAPTAIN_TO_CREW_TYPE, ALL_ENEMY_SHIPS } from '~/utils/Constants'

export class ObjectPlacer {
  static groupObjectsIntoLayer(objects: any[]) {
    const layerMapping = {}
    objects.forEach((obj) => {
      const { placement } = obj
      Object.keys(placement).forEach((layer) => {
        layer = layer.toLowerCase()
        if (!layerMapping[layer]) layerMapping[layer] = []
        layerMapping[layer].push(obj)
      })
    })
    return layerMapping
  }

  static isInnerTile(tileCode: number) {
    const layerKeys = Object.keys(Constants.LAYER_MAPPING)
    for (let i = 0; i < layerKeys.length; i++) {
      const layerConfig = Constants.LAYER_MAPPING[layerKeys[i]]
      const { tiles } = layerConfig
      if (tiles.includes(tileCode)) {
        return true
      }
    }
    return false
  }

  private static addEnemyShip(
    x: number,
    y: number,
    config: { shipType: string; captainMobType: string },
    scene: Game
  ) {
    const { shipType, captainMobType } = config
    const shipConfig = Constants.getShip(shipType)
    const mobConfig = Constants.getMob(captainMobType)
    if (shipConfig && mobConfig) {
      const enemyShipCaptain = new Mob(scene, 0, 0, mobConfig)
      const enemyShip = new EnemyShip(scene, shipConfig, { x, y })
      enemyShip.setCrew(CAPTAIN_TO_CREW_TYPE[captainMobType], shipConfig.numCrew)
      enemyShip.setMobInControl(enemyShipCaptain)
      enemyShipCaptain.startSailing(enemyShip)
      scene.ships.add(enemyShip.hullSprite)
      scene.addMob(enemyShipCaptain)
    }
  }

  static placeEnemyShipsFromTilemap(tileMap: number[][], numShips: number): any[] {
    const isSurroundingOcean = (
      tileMap: number[][],
      x: number,
      y: number,
      searchArea: number,
      shipPositions: any
    ) => {
      if (
        x - searchArea < 0 ||
        x + searchArea > tileMap.length ||
        y - searchArea < 0 ||
        y + searchArea > tileMap[0].length
      ) {
        return false
      }
      for (let i = x - searchArea; i < x + searchArea; i++) {
        for (let j = y - searchArea; j < y + searchArea; j++) {
          const tileCode = tileMap[i][j]
          if (Constants.getLayer(tileCode) !== 'OCEAN' && !shipPositions.has(`${i},${j}`)) {
            return false
          }
        }
      }
      return true
    }

    const shipsToAdd: any[] = []
    const shipPositions = new Set()
    const allOceanTiles: number[][] = []

    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[0].length; j++) {
        const tileLayer = Constants.getLayer(tileMap[i][j])
        if (tileLayer === 'OCEAN') {
          allOceanTiles.push([i, j])
        }
      }
    }

    // For all ocean tiles, sample a fixed random number and check if they have enough space to hold a ship
    const shuffledTiles = shuffle(allOceanTiles)

    for (let i = 0; i < 1000; i++) {
      const [x, y] = shuffledTiles[i]
      if (isSurroundingOcean(tileMap, x, y, 20, shipPositions) && shipsToAdd.length < numShips) {
        shipPositions.add(`${x},${y}`)
        const randomShipConfig = ALL_ENEMY_SHIPS[Constants.getRandomNum(0, ALL_ENEMY_SHIPS.length)]
        shipsToAdd.push({
          ...randomShipConfig,
          x: y * Constants.TILE_SIZE,
          y: x * Constants.TILE_SIZE,
        })
      }
    }

    console.log(shipsToAdd)

    return shipsToAdd
  }

  static placeHarvestablesFromTilemap(
    harvestables: any[],
    tileMap: number[][],
    perlinMap: number[][],
    toIgnore: number[][]
  ) {
    const layerMapping = this.groupObjectsIntoLayer(harvestables)
    const objectMap: any[] = []
    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[0].length; j++) {
        const layer = Constants.getLayer(tileMap[i][j])
        if (layer && this.isInnerTile(tileMap[i][j]) && toIgnore[i][j] === 0) {
          const objectsForLayer = layerMapping[layer.toLowerCase()]
          if (objectsForLayer) {
            const perlinMapSeed = `${perlinMap[i][j]}`
            const randomItem = objectsForLayer[(i + j) % objectsForLayer.length]
            const randomNumber = Constants.getSeedRandomNum(1, 100, perlinMapSeed)
            const placeRate = 100 * randomItem.placement[layer.toLowerCase()]
            if (randomNumber < placeRate) {
              objectMap.push({
                tileX: i,
                tileY: j,
                x: j * Constants.TILE_SIZE + Constants.getSeedRandomNum(-5, 5, perlinMapSeed),
                y: i * Constants.TILE_SIZE - 16 + Constants.getSeedRandomNum(-5, 5, perlinMapSeed),
                type: randomItem.name,
              })
            }
          }
        }
      }
    }
    return objectMap
  }

  static placeMobsFromTilemap(mobs: any[], tilemap: number[][], harvestables: any[]): any[] {
    const spawnerLocations: any[] = []

    // Construct a map for looking up if harvestables exist
    const harvestablesMap = new Array(tilemap.length)
      .fill(0)
      .map(() => new Array(tilemap[0].length).fill(0))
    harvestables.forEach((harvestable) => {
      const { tileX, tileY } = harvestable
      harvestablesMap[tileX][tileY] = 1
    })

    const isOpenSpace = (tilemap, i, j) => {
      const xRange = 2
      const yRange = 2
      const startX = Math.max(0, i - xRange)
      const endX = Math.min(i + yRange, tilemap.length)
      const startY = Math.max(0, j - yRange)
      const endY = Math.min(j + yRange, tilemap[0].length)
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          if (harvestables[i] && harvestables[i][j]) {
            return false
          }
        }
      }
      return true
    }

    const layerToMobMapping = this.groupObjectsIntoLayer(mobs)
    for (let i = 0; i < tilemap.length; i++) {
      for (let j = 0; j < tilemap[0].length; j++) {
        // Check if there's an open space
        if (isOpenSpace(tilemap, i, j)) {
          const tileCode = tilemap[i][j]
          const layer = Constants.getLayer(tileCode)
          if (layer && this.isInnerTile(tileCode)) {
            const mobsForLayer = layerToMobMapping[layer.toLowerCase()]
            if (mobsForLayer) {
              const randomMob = mobsForLayer[Constants.getRandomNum(0, mobsForLayer.length)]
              const randomNumber = Constants.getRandomNum(1, 1000)
              const placeRate = 1000 * randomMob.placement[layer.toLowerCase()]
              if (randomNumber <= placeRate) {
                spawnerLocations.push({
                  tileX: i,
                  tileY: j,
                  x: j * Constants.TILE_SIZE + Constants.getRandomNum(-5, 5),
                  y: i * Constants.TILE_SIZE + Constants.getRandomNum(-5, 5),
                  type: randomMob.name,
                })
              }
            }
          }
        }
      }
    }
    return spawnerLocations
  }
}
