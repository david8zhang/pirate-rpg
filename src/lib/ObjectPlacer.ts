import { Constants } from '~/utils/Constants'

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
          if (harvestables[i][j]) {
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
