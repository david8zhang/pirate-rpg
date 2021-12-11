import { Constants } from '~/utils/Constants'
import seedrng from 'seedrandom'

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

  static placeObjectsFromTilemap(objects: any[], tileMap: number[][], perlinMap: number[][]) {
    const layerMapping = this.groupObjectsIntoLayer(objects)
    const objectMap: any[] = []
    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[0].length; j++) {
        const layer = Constants.getLayer(tileMap[i][j])
        if (layer && this.isInnerTile(tileMap[i][j])) {
          const objectsForLayer = layerMapping[layer.toLowerCase()]
          if (objectsForLayer) {
            const perlinMapSeed = `${perlinMap[i][j]}`
            const randomItem = objectsForLayer[(i + j) % objectsForLayer.length]
            const randomNumber = Constants.getSeedRandomNum(1, 100, perlinMapSeed)
            const placeRate = 100 * randomItem.placement[layer.toLowerCase()]
            if (randomNumber < placeRate) {
              objectMap.push({
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
}
