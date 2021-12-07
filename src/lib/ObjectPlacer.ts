import { Constants } from '~/utils/Constants'

export class ObjectPlacer {
  static groupObjectsIntoLayer(objects: any[]) {
    const layerMapping = {}
    objects.forEach((obj) => {
      const { layers } = obj
      layers.forEach((layer) => {
        layer = layer.toLowerCase()
        if (!layerMapping[layer]) layerMapping[layer] = []
        layerMapping[layer].push(obj)
      })
    })
    return layerMapping
  }

  static placeObjectsFromTilemap(objects: any[], tileMap: number[][]) {
    const layerMapping = ObjectPlacer.groupObjectsIntoLayer(objects)
    console.log(layerMapping)
    const objectMap: any[] = []
    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[0].length; j++) {
        const layer = Constants.getLayer(tileMap[i][j])
        if (layer) {
          const objectsForLayer = layerMapping[layer.toLowerCase()]
          if (objectsForLayer) {
            const randomItem = objectsForLayer[Math.floor(Math.random() * objectsForLayer.length)]
            const placeRate = Math.round(randomItem.placeRate * 100)
            const randomNumber = Constants.getRandomNum(0, 100)
            if (randomNumber <= placeRate) {
              objectMap.push({
                x: j * Constants.TILE_SIZE + 32 + Constants.getRandomNum(-5, 5),
                y: i * Constants.TILE_SIZE - 32 + Constants.getRandomNum(-5, 5),
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
