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

  static placeObjectsFromTilemap(objects: any[], tileMap: number[][]) {
    const layerMapping = ObjectPlacer.groupObjectsIntoLayer(objects)
    const objectMap: any[] = []
    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[0].length; j++) {
        const layer = Constants.getLayer(tileMap[i][j])
        if (layer && this.isInnerTile(tileMap[i][j])) {
          const objectsForLayer = layerMapping[layer.toLowerCase()]
          if (objectsForLayer) {
            const randomItem = objectsForLayer[Math.floor(Math.random() * objectsForLayer.length)]
            const randomNumber = Constants.getRandomNum(1, 100)
            const placeRate = 100 * randomItem.placement[layer.toLowerCase()]
            if (randomNumber <= placeRate) {
              objectMap.push({
                x: j * Constants.TILE_SIZE + Constants.getRandomNum(-5, 5),
                y: i * Constants.TILE_SIZE - 16 + Constants.getRandomNum(-5, 5),
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
