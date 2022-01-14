import { Constants } from '~/utils/Constants'
import Perlin from 'phaser3-rex-plugins/plugins/perlin.js'

interface PerlinConfig {
  height: number
  width: number
  scale: number
  octaves: number
  persistence: number
  lacunarity: number
  seed: number
  offset: { x: number; y: number }
}

export class MapGenerator {
  static getTileMap(seed, offsetsConfig: { x: number; y: number }) {
    const perlinConfig = {
      height: Constants.GAME_HEIGHT,
      width: Constants.GAME_WIDTH,
      scale: Constants.PERLIN_MAP_SCALE,
      octaves: 4,
      persistence: 0.1,
      lacunarity: 1,
      seed: seed,
      offset: {
        x: offsetsConfig.x * Constants.GAME_HEIGHT,
        y: offsetsConfig.y * Constants.GAME_WIDTH,
      },
    }
    const perlinTileGrid = MapGenerator.generatePerlinTilegrid(perlinConfig)
    const tileMap = MapGenerator.generateTileMapFromPerlinNoise(perlinTileGrid)
    return { tileMap, perlinTileGrid }
  }

  static generatePerlinTilegrid(config: PerlinConfig) {
    const { seed, scale, height, width, offset } = config
    var noise = new Perlin(seed)
    const tileGrid: number[][] = []
    let maxNoiseHeight = Number.MIN_SAFE_INTEGER
    let minNoiseHeight = Number.MAX_SAFE_INTEGER

    const halfWidth = width / 2
    const halfHeight = height / 2

    for (let i = 0; i < height; i++) {
      tileGrid[i] = new Array(width)
      for (let j = 0; j < width; j++) {
        const x = (i + offset.x - halfHeight) / scale
        const y = (j + offset.y - halfWidth) / scale
        const perlinValue = noise.perlin2(x, y)
        maxNoiseHeight = Math.max(maxNoiseHeight, perlinValue)
        minNoiseHeight = Math.min(minNoiseHeight, perlinValue)
        tileGrid[i][j] = perlinValue
      }
    }
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        tileGrid[i][j] = Constants.inverseLerp(minNoiseHeight, maxNoiseHeight, tileGrid[i][j])
      }
    }
    return tileGrid
  }

  static generateTileMapFromPerlinNoise(perlinTileMap: number[][]) {
    const map: number[][] = []
    const elevationConfig = Constants.getElevationConfig()

    for (let i = 0; i < perlinTileMap.length; i++) {
      map[i] = new Array(perlinTileMap[0].length)
      for (let j = 0; j < perlinTileMap[0].length; j++) {
        const perlinValue = perlinTileMap[i][j]
        map[i][j] = Constants.getTileCodeForElevation(perlinValue, elevationConfig)
      }
    }
    const isInBounds = (coord: number[]) => {
      const [i, j] = coord
      return i >= 0 && i < perlinTileMap.length && j >= 0 && j < perlinTileMap[0].length
    }

    // Get rid of single tiles
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        const currTile = map[i][j]
        // Check if the tile is an edge or corner tile
        const left = [i, j - 1]
        const right = [i, j + 1]
        const upper = [i - 1, j]
        const lower = [i + 1, j]

        if (isInBounds(upper) && isInBounds(lower) && isInBounds(right)) {
          const upperTile = map[upper[0]][upper[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const rightTile = map[right[0]][right[1]]
          if (upperTile == lowerTile && upperTile == rightTile && upperTile !== currTile) {
            map[i][j] = upperTile
          }
        }
        if (isInBounds(upper) && isInBounds(lower) && isInBounds(left)) {
          const upperTile = map[upper[0]][upper[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const leftTile = map[left[0]][left[1]]
          if (upperTile == lowerTile && upperTile == leftTile && upperTile !== currTile) {
            map[i][j] = upperTile
          }
        }
        if (isInBounds(right) && isInBounds(lower) && isInBounds(left)) {
          const rightTile = map[right[0]][right[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const leftTile = map[left[0]][left[1]]
          if (rightTile == lowerTile && rightTile == leftTile && rightTile !== currTile) {
            map[i][j] = rightTile
          }
        }
        if (isInBounds(right) && isInBounds(upper) && isInBounds(left)) {
          const rightTile = map[right[0]][right[1]]
          const upperTile = map[upper[0]][upper[1]]
          const leftTile = map[left[0]][left[1]]
          if (rightTile == upperTile && rightTile == leftTile && rightTile !== currTile) {
            map[i][j] = rightTile
          }
        }
      }
    }

    // Basic edge cases
    let newMap = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0))
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        const currTile = map[i][j]
        const currPerlinTile = perlinTileMap[i][j]

        // Check if the tile is an edge or corner tile
        const left = [i, j - 1]
        const right = [i, j + 1]
        const upper = [i - 1, j]
        const lower = [i + 1, j]

        newMap[i][j] = map[i][j]

        // Check if upper edge
        if (isInBounds(upper) && isInBounds(lower)) {
          const upperTile = map[upper[0]][upper[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const perlinMapUpper = perlinTileMap[upper[0]][upper[1]]
          const perlinMapLower = perlinTileMap[lower[0]][lower[1]]

          if (
            upperTile !== currTile &&
            (lowerTile == currTile || perlinMapLower > currPerlinTile) &&
            currPerlinTile > perlinMapUpper
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'upper')
          } else if (
            lowerTile !== currTile &&
            (upperTile == currTile || perlinMapUpper > currPerlinTile) &&
            currPerlinTile > perlinMapLower
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'lower')
          }
        }

        // Check if right edge
        if (isInBounds(right) && isInBounds(left)) {
          const rightTile = map[right[0]][right[1]]
          const leftTile = map[left[0]][left[1]]
          const perlinMapRight = perlinTileMap[right[0]][right[1]]
          const perlinMapLeft = perlinTileMap[left[0]][left[1]]
          if (
            rightTile !== currTile &&
            (leftTile == currTile || perlinMapLeft > currPerlinTile) &&
            currPerlinTile > perlinMapRight
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'right')
          } else if (
            leftTile !== currTile &&
            (rightTile == currTile || perlinMapRight > currPerlinTile) &&
            currPerlinTile > perlinMapLeft
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'left')
          }
        }

        // Check if upper right corner
        if (isInBounds(upper) && isInBounds(right)) {
          const rightTile = map[right[0]][right[1]]
          const upperTile = map[upper[0]][upper[1]]
          const perlinRight = perlinTileMap[right[0]][right[1]]
          const perlinUpper = perlinTileMap[upper[0]][upper[1]]
          if (
            rightTile !== currTile &&
            upperTile !== currTile &&
            currPerlinTile > perlinUpper &&
            currPerlinTile > perlinRight
          ) {
            newMap[i][j] = Constants.getCornerTile(currTile, 'upperRight')
          }
        }

        // Check if lower right corner
        if (isInBounds(lower) && isInBounds(right)) {
          const rightTile = map[right[0]][right[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const perlinRight = perlinTileMap[right[0]][right[1]]
          const perlinLower = perlinTileMap[lower[0]][lower[1]]
          if (
            rightTile !== currTile &&
            lowerTile !== currTile &&
            currPerlinTile > perlinLower &&
            currPerlinTile > perlinRight
          ) {
            newMap[i][j] = Constants.getCornerTile(currTile, 'lowerRight')
          }
        }

        // Check if lower right corner
        if (isInBounds(lower) && isInBounds(left)) {
          const leftTile = map[left[0]][left[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const perlinLeft = perlinTileMap[left[0]][left[1]]
          const perlinLower = perlinTileMap[lower[0]][lower[1]]
          if (
            leftTile !== currTile &&
            lowerTile !== currTile &&
            currPerlinTile > perlinLower &&
            currPerlinTile > perlinLeft
          ) {
            newMap[i][j] = Constants.getCornerTile(currTile, 'lowerLeft')
          }
        }
        // Check if lower right corner
        if (isInBounds(upper) && isInBounds(left)) {
          const leftTile = map[left[0]][left[1]]
          const upperTile = map[upper[0]][upper[1]]
          const perlinLeft = perlinTileMap[left[0]][left[1]]
          const perlinUpper = perlinTileMap[upper[0]][upper[1]]
          if (
            leftTile !== currTile &&
            upperTile !== currTile &&
            currPerlinTile > perlinUpper &&
            currPerlinTile > perlinLeft
          ) {
            newMap[i][j] = Constants.getCornerTile(currTile, 'upperLeft')
          }
        }

        // Check inner corners
        const leftUpperDiag = [i - 1, j - 1]
        const rightUpperDiag = [i - 1, j + 1]
        const leftLowerDiag = [i + 1, j - 1]
        const rightLowerDiag = [i + 1, j + 1]
        if (isInBounds(upper) && isInBounds(right) && isInBounds(rightUpperDiag)) {
          const rightTile = map[right[0]][right[1]]
          const upperTile = map[upper[0]][upper[1]]
          const rightUpperDiagTile = map[rightUpperDiag[0]][rightUpperDiag[1]]
          const perlinRightUpperDiag = perlinTileMap[rightUpperDiag[0]][rightUpperDiag[1]]
          if (
            rightTile == currTile &&
            upperTile == currTile &&
            rightUpperDiagTile !== currTile &&
            currPerlinTile > perlinRightUpperDiag
          ) {
            if (newMap[i][j] == map[i][j]) {
              newMap[i][j] = Constants.getCornerTile(currTile, 'upperInnerRight')
            }
          }
        }

        if (isInBounds(upper) && isInBounds(left) && isInBounds(leftUpperDiag)) {
          const leftTile = map[left[0]][left[1]]
          const upperTile = map[upper[0]][upper[1]]
          const leftUpperDiagTile = map[leftUpperDiag[0]][leftUpperDiag[1]]
          const perlinLeftUpperDiag = perlinTileMap[leftUpperDiag[0]][leftUpperDiag[1]]
          if (
            leftTile == currTile &&
            upperTile == currTile &&
            leftUpperDiagTile !== currTile &&
            currPerlinTile > perlinLeftUpperDiag
          ) {
            if (newMap[i][j] == map[i][j]) {
              newMap[i][j] = Constants.getCornerTile(currTile, 'upperInnerLeft')
            }
          }
        }

        if (isInBounds(lower) && isInBounds(left) && isInBounds(leftLowerDiag)) {
          const leftTile = map[left[0]][left[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const leftLowerDiagTile = map[leftLowerDiag[0]][leftLowerDiag[1]]
          const perlinLeftLowerDiag = perlinTileMap[leftLowerDiag[0]][leftLowerDiag[1]]
          if (
            leftTile == currTile &&
            lowerTile == currTile &&
            leftLowerDiagTile !== currTile &&
            currPerlinTile > perlinLeftLowerDiag
          ) {
            if (newMap[i][j] == map[i][j]) {
              newMap[i][j] = Constants.getCornerTile(currTile, 'lowerInnerLeft')
            }
          }
        }

        if (isInBounds(lower) && isInBounds(right) && isInBounds(rightLowerDiag)) {
          const rightTile = map[right[0]][right[1]]
          const lowerTile = map[lower[0]][lower[1]]
          const rightLowerDiagTile = map[rightLowerDiag[0]][rightLowerDiag[1]]
          const perlinRightLowerDiag = perlinTileMap[rightLowerDiag[0]][rightLowerDiag[1]]
          if (
            rightTile == currTile &&
            lowerTile == currTile &&
            rightLowerDiagTile !== currTile &&
            currPerlinTile > perlinRightLowerDiag
          ) {
            if (newMap[i][j] == map[i][j]) {
              newMap[i][j] = Constants.getCornerTile(currTile, 'lowerInnerRight')
            }
          }
        }
      }
    }

    // Out of bounds tile cases
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        const currTile = map[i][j]

        // Check if the tile is an edge or corner tile
        const left = [i, j - 1]
        const right = [i, j + 1]
        const upper = [i - 1, j]
        const lower = [i + 1, j]
        if (!isInBounds(lower) && isInBounds(upper)) {
          const upperTile = map[upper[0]][upper[1]]
          if (
            Constants.getLayerIndex(upperTile) < Constants.getLayerIndex(currTile) &&
            newMap[i][j] == map[i][j]
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'upper')
          }
        }
        if (!isInBounds(upper) && isInBounds(lower)) {
          const lowerTile = map[lower[0]][lower[1]]
          if (
            Constants.getLayerIndex(lowerTile) < Constants.getLayerIndex(currTile) &&
            newMap[i][j] == map[i][j]
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'lower')
          }
        }
        if (!isInBounds(right) && isInBounds(left)) {
          const leftTile = map[left[0]][left[1]]
          if (
            Constants.getLayerIndex(leftTile) < Constants.getLayerIndex(currTile) &&
            newMap[i][j] == map[i][j]
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'left')
          }
        }
        if (!isInBounds(left) && isInBounds(right)) {
          const rightTile = map[right[0]][right[1]]
          if (
            Constants.getLayerIndex(rightTile) < Constants.getLayerIndex(currTile) &&
            newMap[i][j] == map[i][j]
          ) {
            newMap[i][j] = Constants.getEdgeTile(currTile, 'right')
          }
        }
      }
    }
    return newMap
  }

  static splitIntoLayers(data: number[][]) {
    const layers = {}
    Constants.LAYERS.forEach((layerName: string) => {
      layers[layerName] = new Array(data.length)
        .fill(-1)
        .map(() => new Array(data[0].length).fill(-1))
    })
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        const tileCode = data[i][j]
        const tileType = Constants.getLayer(tileCode)
        const layer = Constants.TILE_TYPE_TO_LAYER_MAPPING[tileType]
        layers[layer][i][j] = tileCode
      }
    }
    return layers
  }
}
