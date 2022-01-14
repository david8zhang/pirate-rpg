import { Direction } from '~/characters/Player'
import { Harvestable } from '../objects/Harvestable'
import { ItemConfig, ItemTypes } from '../objects/ItemConfig'
import seedrandom from 'seedrandom'

export class Constants {
  // UI Constants
  public static HEALTH_BAR_WIDTH = 150
  public static HEALTH_BAR_HEIGHT = 15
  public static MAX_HEALTH = 100
  public static HEALTH_BAR_FILL_COLOR = 0x2ecc71
  public static HEALTH_BAR_BORDER_WIDTH = 4
  public static STAMINA_BAR_FILL_COLOR = 0x3c73a8
  public static MAX_STAMINA = 100

  // Tile codes
  public static SAND_1 = 0
  public static SAND_2 = 1
  public static SAND_UPPER_LEFT_CORNER = 2
  public static SAND_UPPER_RIGHT_CORNER = 3
  public static SAND_LEFT_EDGE = 4
  public static SAND_RIGHT_EDGE = 5
  public static SAND_UPPER_EDGE = 6
  public static SAND_LOWER_LEFT_CORNER = 7
  public static SAND_LOWER_RIGHT_CORNER = 8
  public static SAND_LOWER_EDGE = 9

  public static WET_SAND_TILE = 12
  public static WET_SAND_LEFT_EDGE = 13
  public static WET_SAND_LOWER_EDGE = 14
  public static WET_SAND_RIGHT_EDGE = 15
  public static WET_SAND_UPPER_EDGE = 16
  public static WET_SAND_UPPER_RIGHT_CORNER = 17
  public static WET_SAND_LOWER_LEFT_CORNER = 18
  public static WET_SAND_LOWER_RIGHT_CORNER = 19
  public static WET_SAND_UPPER_LEFT_CORNER = 20
  public static WET_SAND_LOWER_INNER_LEFT_CORNER = 21
  public static WET_SAND_UPPER_INNER_LEFT_CORNER = 22
  public static WET_SAND_UPPER_INNER_RIGHT_CORNER = 23
  public static WET_SAND_LOWER_INNER_RIGHT_CORNER = 24

  public static SHALLOW_OCEAN_TILE = 25
  public static SHALLOW_OCEAN_LOWER_LEFT_CORNER = 26
  public static SHALLOW_OCEAN_LOWER_RIGHT_CORNER = 27
  public static SHALLOW_OCEAN_UPPER_RIGHT_CORNER = 28
  public static SHALLOW_OCEAN_UPPER_LEFT_CORNER = 29
  public static SHALLOW_OCEAN_LOWER_INNER_RIGHT_CORNER = 30
  public static SHALLOW_OCEAN_UPPER_INNER_RIGHT_CORNER = 31
  public static SHALLOW_OCEAN_UPPER_INNER_LEFT_CORNER = 32
  public static SHALLOW_OCEAN_LOWER_INNER_LEFT_CORNER = 33
  public static SHALLOW_OCEAN_LOWER_EDGE = 34
  public static SHALLOW_OCEAN_LEFT_EDGE = 35
  public static SHALLOW_OCEAN_RIGHT_EDGE = 36
  public static SHALLOW_OCEAN_UPPER_EDGE = 37

  public static OCEAN_TILE = 38

  public static GRASS_1 = 39
  public static GRASS_2 = 40
  public static GRASS_3 = 49
  public static GRASS_UPPER_LEFT_CORNER = 41
  public static GRASS_UPPER_RIGHT_CORNER = 42
  public static GRASS_LOWER_RIGHT_CORNER = 43
  public static GRASS_LOWER_LEFT_CORNER = 44
  public static GRASS_UPPER_EDGE = 45
  public static GRASS_RIGHT_EDGE = 46
  public static GRASS_LEFT_EDGE = 47
  public static GRASS_LOWER_EDGE = 48
  public static PERLIN_MAP_SCALE = 50
  public static LAYER_MAPPING = {
    GRASS: {
      tiles: [Constants.GRASS_1, Constants.GRASS_2, Constants.GRASS_3],
      corners: {
        upperLeft: Constants.GRASS_UPPER_LEFT_CORNER,
        upperRight: Constants.GRASS_UPPER_RIGHT_CORNER,
        lowerLeft: Constants.GRASS_LOWER_LEFT_CORNER,
        lowerRight: Constants.GRASS_LOWER_RIGHT_CORNER,
      },
      edges: {
        upper: Constants.GRASS_UPPER_EDGE,
        lower: Constants.GRASS_LOWER_EDGE,
        left: Constants.GRASS_LEFT_EDGE,
        right: Constants.GRASS_RIGHT_EDGE,
      },
    },
    SAND: {
      tiles: [Constants.SAND_1, Constants.SAND_2],
      corners: {
        upperLeft: Constants.SAND_UPPER_LEFT_CORNER,
        upperRight: Constants.SAND_UPPER_RIGHT_CORNER,
        lowerLeft: Constants.SAND_LOWER_LEFT_CORNER,
        lowerRight: Constants.SAND_LOWER_RIGHT_CORNER,
      },
      edges: {
        upper: Constants.SAND_UPPER_EDGE,
        lower: Constants.SAND_LOWER_EDGE,
        left: Constants.SAND_LEFT_EDGE,
        right: Constants.SAND_RIGHT_EDGE,
      },
    },
    WET_SAND: {
      tiles: [Constants.WET_SAND_TILE],
      corners: {
        upperLeft: Constants.WET_SAND_UPPER_LEFT_CORNER,
        upperRight: Constants.WET_SAND_UPPER_RIGHT_CORNER,
        lowerLeft: Constants.WET_SAND_LOWER_LEFT_CORNER,
        lowerRight: Constants.WET_SAND_LOWER_RIGHT_CORNER,
        upperInnerRight: Constants.WET_SAND_UPPER_INNER_RIGHT_CORNER,
        upperInnerLeft: Constants.WET_SAND_UPPER_INNER_LEFT_CORNER,
        lowerInnerRight: Constants.WET_SAND_LOWER_INNER_RIGHT_CORNER,
        lowerInnerLeft: Constants.WET_SAND_LOWER_INNER_LEFT_CORNER,
      },
      edges: {
        upper: Constants.WET_SAND_UPPER_EDGE,
        lower: Constants.WET_SAND_LOWER_EDGE,
        left: Constants.WET_SAND_LEFT_EDGE,
        right: Constants.WET_SAND_RIGHT_EDGE,
      },
    },
    SHALLOW_OCEAN: {
      tiles: [Constants.SHALLOW_OCEAN_TILE],
      corners: {
        upperLeft: Constants.SHALLOW_OCEAN_UPPER_LEFT_CORNER,
        upperRight: Constants.SHALLOW_OCEAN_UPPER_RIGHT_CORNER,
        lowerLeft: Constants.SHALLOW_OCEAN_LOWER_LEFT_CORNER,
        lowerRight: Constants.SHALLOW_OCEAN_LOWER_RIGHT_CORNER,
        upperInnerRight: Constants.SHALLOW_OCEAN_UPPER_INNER_RIGHT_CORNER,
        upperInnerLeft: Constants.SHALLOW_OCEAN_UPPER_INNER_LEFT_CORNER,
        lowerInnerRight: Constants.SHALLOW_OCEAN_LOWER_INNER_RIGHT_CORNER,
        lowerInnerLeft: Constants.SHALLOW_OCEAN_LOWER_INNER_LEFT_CORNER,
      },
      edges: {
        upper: Constants.SHALLOW_OCEAN_UPPER_EDGE,
        lower: Constants.SHALLOW_OCEAN_LOWER_EDGE,
        left: Constants.SHALLOW_OCEAN_LEFT_EDGE,
        right: Constants.SHALLOW_OCEAN_RIGHT_EDGE,
      },
    },
    OCEAN: {
      tiles: [Constants.OCEAN_TILE],
    },
  }

  public static TILE_PERCENTAGE_BREAKDOWNS = [
    {
      tileType: Constants.OCEAN_TILE,
      percentage: 0.55,
    },
    {
      tileType: Constants.SHALLOW_OCEAN_TILE,
      percentage: 0.05,
    },
    {
      tileType: Constants.WET_SAND_TILE,
      percentage: 0.05,
    },
    {
      tileType: Constants.SAND_1,
      percentage: 0.15,
    },
    {
      tileType: Constants.GRASS_3,
      percentage: 0.2,
    },
  ]

  public static TILE_TYPE_TO_LAYER_MAPPING = {
    OCEAN: 'Ocean',
    SHALLOW_OCEAN: 'Sand',
    WET_SAND: 'Sand',
    SAND: 'Sand',
    GRASS: 'Grass',
  }
  public static LAYERS = ['Ocean', 'Sand', 'Grass']

  static get TILE_SIZE() {
    return 16
  }
  static get BG_HEIGHT() {
    return Constants.GAME_HEIGHT * Constants.TILE_SIZE
  }
  static get BG_WIDTH() {
    return Constants.GAME_WIDTH * Constants.TILE_SIZE
  }

  static get GAME_WIDTH() {
    return 250
  }

  static get GAME_HEIGHT() {
    return 250
  }

  static get ATTACK_DURATION() {
    return 400
  }
  static get WEAPON_SWING_DURATION() {
    return 575
  }

  static getSquaredDistance(point1: { x: number; y: number }, point2: { x: number; y: number }) {
    const diff = {
      x: point1.x - point2.x,
      y: point1.y - point2.y,
    }
    return diff.x * diff.x + diff.y * diff.y
  }

  static getMob(mobName: string) {
    return ALL_MOBS.find((mobConfig) => mobConfig.name.toLowerCase() === mobName.toLowerCase())
  }

  static getItem(itemName: string) {
    if (!itemName) {
      return undefined
    }
    return ALL_ITEMS.find((itemConfig) => itemConfig.name.toLowerCase() === itemName.toLowerCase())
  }

  static getShip(shipName: string) {
    if (!shipName) {
      return undefined
    }
    return ALL_SHIP_TYPES.find(
      (shipConfig) => shipConfig.name.toLowerCase() === shipName.toLowerCase()
    )
  }

  static getEffect(effectName: string) {
    if (!effectName) {
      return undefined
    }
    return ALL_EFFECTS.find(
      (effectConfig) => effectConfig.name.toLowerCase() === effectName.toLowerCase()
    )
  }

  static getHarvestable(harvestableName: string) {
    if (!harvestableName) {
      return undefined
    }
    return ALL_HARVESTABLES.find(
      (harvestableConfig) => harvestableConfig.name.toLowerCase() == harvestableName.toLowerCase()
    )
  }

  static getRandomNum(min: number, max: number, isFloat: boolean = false) {
    if (isFloat) {
      return Math.random() * (max - min) + min
    }
    return Math.floor(Math.random() * (max - min) + min)
  }

  static getSeedRandomNum(min: number, max: number, seed: string) {
    const seedRng = new seedrandom(seed)
    return Math.floor(seedRng() * (max - min) + min)
  }

  static inverseLerp(a: number, b: number, v: number) {
    return (v - a) / (b - a)
  }

  public static getLayer(tileCode: number) {
    let result = ''
    Object.keys(Constants.LAYER_MAPPING).forEach((layer) => {
      const tiles = Constants.LAYER_MAPPING[layer].tiles
      const corners = Constants.LAYER_MAPPING[layer].corners
      const edges = Constants.LAYER_MAPPING[layer].edges
      const allCornerTiles = corners ? Object.keys(corners).map((key) => corners[key]) : []
      const allEdgeTiles = edges ? Object.keys(edges).map((key) => edges[key]) : []
      if (
        tiles.includes(tileCode) ||
        allCornerTiles.includes(tileCode) ||
        allEdgeTiles.includes(tileCode)
      ) {
        result = layer
      }
    })
    return result
  }

  public static getLayerIndex(tileCode: number) {
    const layerOrdering = ['OCEAN', 'SHALLOW_OCEAN', 'WET_SAND', 'SAND', 'GRASS']
    return layerOrdering.indexOf(this.getLayer(tileCode))
  }

  public static getCornerTile(tileCode: number, edgeType: string) {
    const layer = Constants.getLayer(tileCode)
    if (!layer) {
      return tileCode
    }
    const layerConfig = this.LAYER_MAPPING[layer]
    if (!layerConfig.corners) {
      return tileCode
    }
    switch (edgeType) {
      case 'upperRight': {
        return layerConfig.corners.upperRight
      }
      case 'lowerRight': {
        return layerConfig.corners.lowerRight
      }
      case 'upperLeft': {
        return layerConfig.corners.upperLeft
      }
      case 'lowerLeft': {
        return layerConfig.corners.lowerLeft
      }
      case 'upperInnerLeft': {
        if (!layerConfig.corners.upperInnerLeft) return tileCode
        return layerConfig.corners.upperInnerLeft
      }
      case 'upperInnerRight': {
        if (!layerConfig.corners.upperInnerRight) return tileCode
        return layerConfig.corners.upperInnerRight
      }
      case 'lowerInnerRight': {
        if (!layerConfig.corners.lowerInnerRight) return tileCode
        return layerConfig.corners.lowerInnerRight
      }
      case 'lowerInnerLeft': {
        if (!layerConfig.corners.lowerInnerLeft) return tileCode
        return layerConfig.corners.lowerInnerLeft
      }
      default:
        return tileCode
    }
  }

  public static getEdgeTile(tileCode: number, edgeType: string) {
    const layer = Constants.getLayer(tileCode)
    if (!layer) {
      return tileCode
    }
    const layerConfig = this.LAYER_MAPPING[layer]
    if (!layerConfig.edges) {
      return tileCode
    }
    switch (edgeType) {
      case 'upper': {
        return layerConfig.edges.upper
      }
      case 'lower': {
        return layerConfig.edges.lower
      }
      case 'left': {
        return layerConfig.edges.left
      }
      case 'right': {
        return layerConfig.edges.right
      }
      default:
        return tileCode
    }
  }

  public static getElevationConfig() {
    let currElevation = 0
    const elevations: any[] = []
    Constants.TILE_PERCENTAGE_BREAKDOWNS.forEach((tileConfig) => {
      elevations.push({
        ...tileConfig,
        lower: currElevation,
        upper: currElevation + tileConfig.percentage,
      })
      currElevation += tileConfig.percentage
    })
    return elevations
  }

  public static getTileCodeForElevation(elevation: number, elevations: any) {
    for (let i = 0; i < elevations.length; i++) {
      const tileConfig = elevations[i]
      const { lower, upper, tileType } = tileConfig
      if (elevation > lower && elevation <= upper) {
        return tileType
      }
    }
    return 0
  }

  public static getSpawnPosFromMap(mapData: number[][]) {
    const landTiles = [
      this.GRASS_1,
      this.GRASS_2,
      this.GRASS_3,
      this.SAND_1,
      this.SAND_2,
      this.WET_SAND_TILE,
    ]
    for (let i = 100; i < mapData.length; i++) {
      for (let j = 100; j < mapData[i].length; j++) {
        if (landTiles.includes(mapData[i][j])) {
          return {
            x: j * this.TILE_SIZE,
            y: i * this.TILE_SIZE,
          }
        }
      }
    }
    return {
      x: 100,
      y: 100,
    }
  }
}

export enum AnimationType {
  IDLE_FRONT = 'idleFront',
  IDLE_BACK = 'idleBack',
  IDLE_SIDE = 'idleSide',
  WALK_FRONT = 'walkFront',
  WALK_SIDE = 'walkSide',
  WALK_BACK = 'walkBack',
  HURT_FRONT = 'hurtFront',
  HURT_BACK = 'hurtBack',
  HURT_SIDE = 'hurtSide',
  ATTACK_FRONT = 'attackFront',
  ATTACK_SIDE = 'attackSide',
  ATTACK_BACK = 'attackBack',
  DIE_FRONT = 'dieFront',
  DIE_BACK = 'dieBack',
  DIE_SIDE = 'dieSide',
}

export const ALL_SHIP_TYPES = [
  {
    defaultHealth: 1000,
    name: 'Brig',
    numCrew: 5,
    hullImages: {
      up: 'brig-up',
      down: 'brig-down',
      side: 'brig-side',
    },
    sailsImages: {
      up: 'sails-up',
      down: 'sails-down',
      side: 'sails-side',
    },
    animMapping: {
      moveSide: 'brig-move-side',
      moveUp: 'brig-move-up',
      moveDown: 'brig-move-down',
    },
    animFrameName: 'brig',
    animations: [
      {
        key: 'brig-move-down',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'brig-move-side',
        frames: {
          start: 4,
          end: 7,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'brig-move-up',
        frames: {
          start: 8,
          end: 11,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
    ],
    hullBodyConfig: {
      left: {
        xOffset: 0.2,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      right: {
        xOffset: 1.0,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      up: {
        xOffset: 0.35,
        yOffset: 0.3,
        width: 0.3,
        height: 0.7,
      },
      down: {
        xOffset: 0.33,
        yOffset: 0.25,
        width: 0.3,
        height: 0.7,
      },
    },
    wheelConfig: {
      up: {
        image: 'wheel-up',
        xOffset: 0,
        yOffset: 281,
      },
      left: {
        image: 'wheel-side',
        xOffset: 233,
        yOffset: 128,
      },
      right: {
        image: 'wheel-side',
        xOffset: -233,
        yOffset: 128,
      },
      down: {
        image: 'wheel-down',
        xOffset: -16,
        yOffset: -122,
      },
    },
    colliderConfig: {
      left: [
        {
          xOffset: 80,
          yOffset: 70,
          width: 190,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 80,
          yOffset: 235,
          width: 190,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -55,
          yOffset: 125,
          width: 2,
          height: 100,
          type: 'wall',
        },
        {
          xOffset: 210,
          yOffset: 125,
          width: 2,
          height: 100,
          type: 'wall',
        },
        {
          xOffset: -25,
          yOffset: 55,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 40,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 100,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 182,
          yOffset: 55,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 205,
          yOffset: 40,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 200,
          yOffset: 100,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -40,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -15,
          yOffset: 235,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -45,
          yOffset: 220,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 195,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 175,
          yOffset: 235,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 200,
          yOffset: 220,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -90,
          yOffset: 205,
          width: 80,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 190,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 170,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 160,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 150,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -200,
          yOffset: 130,
          width: 2,
          height: 20,
          type: 'wall',
        },
        {
          xOffset: -90,
          yOffset: 40,
          width: 80,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 190,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 180,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 170,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 80,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 90,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -150,
          yOffset: 50,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -165,
          yOffset: 60,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -175,
          yOffset: 70,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -185,
          yOffset: 80,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -195,
          yOffset: 90,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: -205,
          yOffset: 105,
          width: 20,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 250,
          yOffset: 40,
          width: 65,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 250,
          yOffset: 205,
          width: 65,
          height: 2,
          type: 'wall',
        },
        {
          xOffset: 270,
          yOffset: 120,
          width: 2,
          height: 150,
          type: 'wall',
        },
      ],
      right: [
        {
          xOffset: -80,
          yOffset: 70,
          width: 190,
          height: 2,
        },
        {
          xOffset: -80,
          yOffset: 235,
          width: 190,
          height: 2,
        },
        {
          xOffset: -175,
          yOffset: 60,
          width: 20,
          height: 2,
        },
        {
          xOffset: -185,
          yOffset: 50,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 40,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 100,
          width: 20,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 90,
          width: 20,
          height: 2,
        },
        {
          xOffset: -267,
          yOffset: 49,
          width: 20,
          height: 2,
        },
        {
          xOffset: -235,
          yOffset: 40,
          width: 48,
          height: 2,
        },
        {
          xOffset: -210,
          yOffset: 135,
          width: 2,
          height: 70,
        },
        {
          xOffset: -200,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: -185,
          yOffset: 190,
          width: 10,
          height: 2,
        },
        {
          xOffset: -200,
          yOffset: 222,
          width: 20,
          height: 2,
        },
        {
          xOffset: -235,
          yOffset: 205,
          width: 50,
          height: 2,
        },
        {
          xOffset: -275,
          yOffset: 195,
          width: 20,
          height: 2,
        },
        {
          xOffset: -275,
          yOffset: 120,
          width: 2,
          height: 130,
        },
        {
          xOffset: 20,
          yOffset: 62,
          width: 20,
          height: 2,
        },
        {
          xOffset: 30,
          yOffset: 54,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 46,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: 90,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: 25,
          yOffset: 190,
          width: 20,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 225,
          width: 20,
          height: 2,
        },
        {
          xOffset: 94,
          yOffset: 208,
          width: 80,
          height: 2,
        },
        {
          xOffset: 95,
          yOffset: 40,
          width: 80,
          height: 2,
        },
        {
          xOffset: 55,
          yOffset: 130,
          width: 2,
          height: 80,
        },
        {
          xOffset: 150,
          yOffset: 50,
          width: 20,
          height: 2,
        },
        {
          xOffset: 165,
          yOffset: 65,
          width: 20,
          height: 2,
        },
        {
          xOffset: 180,
          yOffset: 80,
          width: 20,
          height: 2,
        },
        {
          xOffset: 195,
          yOffset: 95,
          width: 20,
          height: 2,
        },
        {
          xOffset: 200,
          yOffset: 126,
          width: 2,
          height: 30,
        },
        {
          xOffset: 195,
          yOffset: 150,
          width: 20,
          height: 2,
        },
        {
          xOffset: 180,
          yOffset: 165,
          width: 20,
          height: 2,
        },
        {
          xOffset: 165,
          yOffset: 180,
          width: 20,
          height: 2,
        },
        {
          xOffset: 150,
          yOffset: 195,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: 103,
          width: 20,
          height: 2,
        },
      ],
      up: [
        {
          xOffset: -88,
          yOffset: 120,
          width: 2,
          height: 400,
        },
        {
          xOffset: 85,
          yOffset: 120,
          width: 2,
          height: 400,
        },
        {
          xOffset: 5,
          yOffset: 335,
          width: 125,
          height: 2,
        },
        {
          xOffset: -75,
          yOffset: 325,
          width: 20,
          height: 2,
        },
        {
          xOffset: 80,
          yOffset: 325,
          width: 20,
          height: 2,
        },
        {
          xOffset: 2,
          yOffset: 265,
          width: 80,
          height: 2,
        },
        {
          xOffset: 40,
          yOffset: 250,
          width: 2,
          height: 25,
        },
        {
          xOffset: -38,
          yOffset: 250,
          width: 2,
          height: 25,
        },
        {
          xOffset: 1,
          yOffset: 20,
          width: 80,
          height: 2,
        },
        {
          xOffset: -38,
          yOffset: 41,
          width: 2,
          height: 65,
        },
        {
          xOffset: 42,
          yOffset: 38,
          width: 2,
          height: 65,
        },
        {
          xOffset: 1,
          yOffset: 8,
          width: 80,
          height: 2,
        },
        {
          xOffset: -72,
          yOffset: -90,
          width: 20,
          height: 2,
        },
        {
          xOffset: -59,
          yOffset: -100,
          width: 20,
          height: 2,
        },
        {
          xOffset: -50,
          yOffset: -110,
          width: 20,
          height: 2,
        },
        {
          xOffset: -40,
          yOffset: -120,
          width: 20,
          height: 2,
        },
        {
          xOffset: -30,
          yOffset: -130,
          width: 20,
          height: 2,
        },
        {
          xOffset: 2,
          yOffset: -140,
          width: 40,
          height: 2,
        },
        {
          xOffset: 35,
          yOffset: -130,
          width: 20,
          height: 2,
        },
        {
          xOffset: 45,
          yOffset: -120,
          width: 20,
          height: 2,
        },
        {
          xOffset: 56,
          yOffset: -110,
          width: 20,
          height: 2,
        },
        {
          xOffset: 65,
          yOffset: -100,
          width: 20,
          height: 2,
        },
        {
          xOffset: 78,
          yOffset: -87,
          width: 20,
          height: 2,
        },
      ],
      down: [
        {
          xOffset: -100,
          yOffset: 45,
          height: 400,
          width: 2,
        },
        {
          xOffset: 70,
          yOffset: 45,
          height: 400,
          width: 2,
        },
        {
          xOffset: -15,
          yOffset: -99,
          height: 2,
          width: 80,
        },
        {
          xOffset: -15,
          yOffset: 160,
          height: 2,
          width: 80,
        },
        {
          xOffset: -55,
          yOffset: -65,
          height: 70,
          width: 2,
        },
        {
          xOffset: 25,
          yOffset: -65,
          height: 70,
          width: 2,
        },
        {
          xOffset: -18,
          yOffset: -170,
          height: 2,
          width: 140,
        },
        {
          xOffset: -90,
          yOffset: -160,
          height: 2,
          width: 20,
        },
        {
          xOffset: 60,
          yOffset: -160,
          height: 2,
          width: 20,
        },
        {
          xOffset: -55,
          yOffset: 145,
          height: 25,
          width: 2,
        },
        {
          xOffset: 25,
          yOffset: 145,
          height: 25,
          width: 2,
        },
        {
          xOffset: -89,
          yOffset: 255,
          height: 2,
          width: 20,
        },
        {
          xOffset: -78,
          yOffset: 265,
          height: 2,
          width: 20,
        },
        {
          xOffset: -67,
          yOffset: 275,
          height: 2,
          width: 20,
        },
        {
          xOffset: -56,
          yOffset: 286,
          height: 2,
          width: 20,
        },
        {
          xOffset: -44,
          yOffset: 300,
          height: 2,
          width: 20,
        },
        {
          xOffset: -16,
          yOffset: 310,
          height: 2,
          width: 40,
        },
        {
          xOffset: 11,
          yOffset: 300,
          height: 2,
          width: 20,
        },
        {
          xOffset: 30,
          yOffset: 286,
          height: 2,
          width: 20,
        },
        {
          xOffset: 39,
          yOffset: 275,
          height: 2,
          width: 20,
        },
        {
          xOffset: 50,
          yOffset: 265,
          height: 2,
          width: 20,
        },
        {
          xOffset: 59,
          yOffset: 255,
          height: 2,
          width: 20,
        },
        {
          xOffset: -15,
          yOffset: -82,
          height: 2,
          width: 80,
        },
      ],
    },
    hitboxConfig: {
      left: [
        {
          xOffset: -37,
          yOffset: 80,
          width: 264,
          height: 231,
        },
        {
          xOffset: -140,
          yOffset: 50,
          width: 100,
          height: 251,
        },
        {
          xOffset: 205,
          yOffset: 50,
          width: 100,
          height: 251,
        },
      ],
      right: [
        {
          xOffset: -270,
          yOffset: 50,
          width: 100,
          height: 231,
        },
        {
          xOffset: -171,
          yOffset: 80,
          width: 264,
          height: 231,
        },
        {
          xOffset: 75,
          yOffset: 50,
          width: 100,
          height: 251,
        },
      ],
      up: [
        {
          xOffset: -75,
          yOffset: -100,
          height: 540,
          width: 185,
        },
      ],
      down: [
        {
          xOffset: -90,
          yOffset: -160,
          height: 540,
          width: 185,
        },
      ],
    },
    ladderConfig: {
      up: {
        image: 'ladder-up',
        xOffset: 85,
        yOffset: 150,
      },
      down: {
        image: 'ladder-down',
        xOffset: -102,
        yOffset: 60,
      },
      left: {
        image: 'ladder-side',
        xOffset: 91,
        yOffset: 263,
      },
      right: {
        image: 'ladder-side',
        xOffset: -65,
        yOffset: 263,
      },
    },
    cannonConfig: {
      left: [
        {
          direction: Direction.UP,
          x: 13,
          y: 80,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.UP,
          x: 148,
          y: 80,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.DOWN,
          x: 13,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
        {
          direction: Direction.DOWN,
          x: 148,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
      ],
      right: [
        {
          direction: Direction.UP,
          x: -142,
          y: 82,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.UP,
          x: -3,
          y: 82,
          body: {
            height: 2,
          },
          texture: 'cannon-up',
        },
        {
          direction: Direction.DOWN,
          x: -142,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
        {
          direction: Direction.DOWN,
          x: -3,
          y: 225,
          body: {
            height: 2,
          },
          texture: 'cannon-down',
        },
      ],
      up: [
        {
          direction: Direction.RIGHT,
          x: 65,
          y: 95,
          body: {
            width: 1.5,
          },
          scaleX: 1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.RIGHT,
          x: 65,
          y: 200,
          body: {
            width: 1.5,
          },
          scaleX: 1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -70,
          y: 95,
          body: {
            offsetX: 80,
            width: 1.5,
          },
          scaleX: -1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -70,
          y: 200,
          body: {
            offsetX: 80,
            width: 1.5,
          },
          scaleX: -1,
          texture: 'cannon-side',
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
      ],
      down: [
        {
          direction: Direction.RIGHT,
          x: 50,
          y: -5,
          scaleX: 1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
          },
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.RIGHT,
          x: 50,
          y: 95,
          scaleX: 1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
          },
          projectileInitPosition: {
            xOffset: 10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -80,
          y: 95,
          scaleX: -1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
            offsetX: 100,
          },
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
        {
          direction: Direction.LEFT,
          x: -80,
          y: -5,
          scaleX: -1,
          texture: 'cannon-side',
          body: {
            width: 1.5,
            offsetX: 100,
          },
          projectileInitPosition: {
            xOffset: -10,
            yOffset: -10,
          },
        },
      ],
    },
    centerOffset: {
      right: {
        x: -57,
        y: 153,
      },
      up: {
        x: 2,
        y: 149,
      },
      down: {
        x: -13,
        y: 30,
      },
      left: {
        x: 75,
        y: 150,
      },
    },
    landDetectorConfig: {
      directions: {
        up: {
          xOffset: 0,
          yOffset: -100,
        },
        down: {
          xOffset: 0,
          yOffset: 300,
        },
        left: {
          xOffset: -200,
          yOffset: 200,
        },
        right: {
          xOffset: 200,
          yOffset: 200,
        },
      },
      size: {
        x: 100,
        y: 100,
      },
    },
  },
  {
    defaultHealth: 500,
    name: 'Sailboat',
    numCrew: 1,
    hullImages: {
      up: 'sailboat-up',
      down: 'sailboat-down',
      side: 'sailboat-side',
    },
    sailsImages: {
      up: 'sailboat-sails-up',
      down: 'sailboat-sails-down',
      side: 'sailboat-sails-side',
    },
    animMapping: {
      moveSide: 'sailboat-move-side',
      moveUp: 'sailboat-move-up',
      moveDown: 'sailboat-move-down',
    },
    animFrameName: 'sailboat',
    animations: [
      {
        key: 'sailboat-move-down',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'sailboat-move-side',
        frames: {
          start: 4,
          end: 7,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'sailboat-move-up',
        frames: {
          start: 8,
          end: 11,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
    ],
    wheelConfig: {
      up: {
        image: 'wheel-up',
        xOffset: 3,
        yOffset: 80,
      },
      left: {
        image: 'wheel-side',
        xOffset: 45,
        yOffset: 52,
      },
      right: {
        image: 'wheel-side',
        xOffset: -40,
        yOffset: 52,
      },
      down: {
        image: 'wheel-down',
        xOffset: 2,
        yOffset: 14,
      },
    },
    hullBodyConfig: {
      left: {
        xOffset: 0.2,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      right: {
        xOffset: 1.0,
        yOffset: 0.6,
        width: 0.8,
        height: 0.4,
      },
      up: {
        xOffset: 0.3,
        yOffset: 0.5,
        width: 0.4,
        height: 0.4,
      },
      down: {
        xOffset: 0.3,
        yOffset: 0.5,
        width: 0.4,
        height: 0.4,
      },
    },
    ladderConfig: {
      up: {
        image: 'sailboat-ladder-up',
        xOffset: 28,
        yOffset: 60,
      },
      down: {
        image: 'sailboat-ladder-down',
        xOffset: -24,
        yOffset: 60,
      },
      left: {
        image: 'sailboat-ladder-side',
        xOffset: 20,
        yOffset: 85,
      },
      right: {
        image: 'sailboat-ladder-side',
        xOffset: -10,
        yOffset: 85,
      },
    },
    colliderConfig: {
      left: [
        {
          xOffset: 14,
          yOffset: 77,
          width: 140,
          height: 2,
        },
        {
          xOffset: 14,
          yOffset: 27,
          width: 140,
          height: 2,
        },
        {
          xOffset: 77,
          yOffset: 47,
          height: 50,
          width: 2,
        },
        {
          xOffset: -64,
          yOffset: 64,
          width: 10,
          height: 2,
        },
        {
          xOffset: -70,
          yOffset: 52,
          width: 2,
          height: 20,
        },
        {
          xOffset: -64,
          yOffset: 41,
          width: 10,
          height: 2,
        },
      ],
      right: [
        {
          xOffset: -8,
          yOffset: 75,
          width: 140,
          height: 2,
        },
        {
          xOffset: -8,
          yOffset: 27,
          width: 140,
          height: 2,
        },
        {
          xOffset: 65,
          yOffset: 63,
          width: 10,
          height: 2,
        },
        {
          xOffset: 65,
          yOffset: 39,
          width: 10,
          height: 2,
        },
        {
          xOffset: 73,
          yOffset: 53,
          width: 2,
          height: 20,
        },
        {
          xOffset: -77,
          yOffset: 52,
          height: 50,
          width: 2,
        },
      ],
      up: [
        {
          xOffset: 27,
          yOffset: 62,
          width: 2,
          height: 120,
        },
        {
          xOffset: -22,
          yOffset: 62,
          width: 2,
          height: 120,
        },
        {
          xOffset: 3,
          yOffset: 120,
          width: 50,
          height: 2,
        },
        {
          xOffset: -12,
          yOffset: -4,
          width: 2,
          height: 10,
        },
        {
          xOffset: 15,
          yOffset: -4,
          width: 2,
          height: 10,
        },
        {
          xOffset: 2,
          yOffset: -11,
          width: 20,
          height: 2,
        },
      ],
      down: [
        {
          xOffset: 3,
          yOffset: -19,
          width: 50,
          height: 2,
        },
        {
          xOffset: -22,
          yOffset: 50,
          height: 130,
          width: 2,
        },
        {
          xOffset: 27,
          yOffset: 50,
          height: 130,
          width: 2,
        },
        {
          xOffset: -10,
          yOffset: 123,
          height: 10,
          width: 2,
        },
        {
          xOffset: 14,
          yOffset: 123,
          height: 10,
          width: 2,
        },
        {
          xOffset: 2,
          yOffset: 130,
          height: 2,
          width: 20,
        },
      ],
    },
    hitboxConfig: {
      left: [
        {
          xOffset: -60,
          yOffset: 40,
          height: 75,
          width: 165,
        },
      ],
      right: [
        {
          xOffset: -60,
          yOffset: 40,
          height: 75,
          width: 165,
        },
      ],
      up: [
        {
          xOffset: -10,
          yOffset: 0,
          height: 165,
          width: 53,
        },
      ],
      down: [
        {
          xOffset: -10,
          yOffset: -5,
          height: 165,
          width: 53,
        },
      ],
    },
    centerOffset: {
      right: {
        x: -6,
        y: 51,
      },
      up: {
        x: 3,
        y: 57,
      },
      down: {
        x: 1,
        y: 60,
      },
      left: {
        x: 9,
        y: 55,
      },
    },
    cannonConfig: {
      left: [],
      right: [],
      up: [],
      down: [],
    },
    landDetectorConfig: {
      size: {
        x: 50,
        y: 50,
      },
      directions: {
        up: {
          xOffset: 2,
          yOffset: -5,
        },
        down: {
          xOffset: 0,
          yOffset: 123,
        },
        left: {
          xOffset: -60,
          yOffset: 50,
        },
        right: {
          xOffset: 50,
          yOffset: 50,
        },
      },
    },
  },
]

export const ALL_ENEMY_SHIPS = [
  {
    shipType: 'Brig',
    captainMobType: 'navy-sailor',
  },
]

export const ALL_HARVESTABLES = [
  {
    name: 'Palm-Tree',
    texture: 'palm-tree-without-coconut',
    health: 100,
    placement: {
      grass: 0.15,
      sand: 0.025,
    },
    dropConfig: {
      hasDropRate: 0.2,
      withDropTexture: 'palm-tree-with-coconut',
      onDropItem: (harvestable: Harvestable) => {
        harvestable.sprite.setTexture('palm-tree-without-coconut')
      },
      droppedItems: [
        {
          name: 'Coconut',
          quantity: 2,
        },
      ],
      onDestroyDrops: [
        {
          name: 'Wood',
          quantity: 5,
        },
        {
          name: 'Frond',
          quantity: 3,
        },
      ],
    },
    defaultFrame: 0,
    bodyResize: {
      width: 0.2,
      height: 0.1,
      offset: {
        y: 53,
      },
    },
    particle: {
      type: 'wood-particle',
      dropLength: 500,
    },
    proximityItems: [
      {
        name: 'Stick',
        max: 3,
      },
    ],
  },
  {
    name: 'Boulder',
    texture: 'boulder',
    health: 200,
    placement: {
      sand: 0.025,
    },
    dropConfig: {
      onDestroyDrops: [
        {
          name: 'Rock',
          quantity: 5,
        },
        {
          name: 'Iron Ore',
          quantity: 1,
        },
      ],
    },
    bodyResize: {
      width: 0.5,
      height: 0.3,
      offset: {
        y: 40,
      },
    },
    particle: {
      type: 'stone-particle',
      dropLength: 550,
    },
    proximityItems: [
      {
        name: 'Rock',
        max: 2,
      },
    ],
  },
  {
    name: 'Banana-tree',
    texture: 'banana-tree-without-banana',
    health: 150,
    placement: {
      grass: 0.05,
    },
    dropConfig: {
      hasDropRate: 0.1,
      withDropTexture: 'banana-tree-with-banana',
      onDropItem: (harvestable: Harvestable) => {
        harvestable.sprite.setTexture('banana-tree-without-banana')
      },
      droppedItems: [
        {
          name: 'Banana',
          quantity: 4,
        },
      ],
      onDestroyDrops: [
        {
          name: 'Wood',
          quantity: 3,
        },
        {
          name: 'Frond',
          quantity: 5,
        },
      ],
    },
    defaultFrame: 0,
    particle: {
      type: 'wood-particle',
      dropLength: 500,
    },
    bodyResize: {
      width: 0.2,
      height: 0.1,
      offset: {
        y: 53,
      },
    },
    proximityItems: [],
  },
]

export const ALL_PARTICLES = [
  {
    name: 'Blood Particle',
    image: 'blood-particle',
    type: ItemTypes.particle,
    description: '',
  },
  {
    name: 'Wood Particle',
    image: 'wood-particle',
    type: ItemTypes.particle,
    description: '',
  },
]

export const ALL_MOBS = [
  {
    name: 'Monkey',
    animFrameName: 'monkey',
    placement: {
      grass: 0.005,
    },
    spawn: {
      lowerLimit: 1,
      upperLimit: 3,
    },
    animMapping: {
      walkFront: 'monkey-walk-front',
      walkSide: 'monkey-walk-side',
      walkBack: 'monkey-walk-back',
      idleFront: 'monkey-idle-front',
      idleSide: 'monkey-idle-side',
      idleBack: 'monkey-idle-back',
      dieFront: 'monkey-die-front',
      dieSide: 'monkey-die-side',
      dieBack: 'monkey-die-back',
      hurtFront: 'monkey-hurt-front',
      hurtSide: 'monkey-hurt-side',
      hurtBack: 'monkey-hurt-back',
      attackFront: 'monkey-attack-front',
      attackSide: 'monkey-attack-side',
      attackBack: 'monkey-attack-back',
    },
    animations: [
      {
        key: 'monkey-idle-front',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-idle-side',
        frames: {
          start: 8,
          end: 11,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-idle-back',
        frames: {
          start: 20,
          end: 23,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      // Walk animations
      {
        key: 'monkey-walk-front',
        frames: {
          start: 12,
          end: 15,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-walk-side',
        frames: {
          start: 4,
          end: 7,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        key: 'monkey-walk-back',
        frames: {
          start: 16,
          end: 19,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      // Hurt animations
      {
        key: 'monkey-hurt-front',
        frames: {
          start: 45,
          end: 47,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        key: 'monkey-hurt-side',
        frames: {
          start: 37,
          end: 37,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        key: 'monkey-hurt-back',
        frames: {
          start: 41,
          end: 41,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      // Death animations
      {
        key: 'monkey-die-front',
        frames: {
          start: 33,
          end: 36,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      {
        key: 'monkey-die-side',
        frames: {
          start: 37,
          end: 40,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      {
        key: 'monkey-die-back',
        frames: {
          start: 41,
          end: 44,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },

      // Attack animations
      {
        key: 'monkey-attack-front',
        frames: {
          start: 24,
          end: 26,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },

      {
        key: 'monkey-attack-side',
        frames: {
          start: 27,
          end: 29,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },
      {
        key: 'monkey-attack-back',
        frames: {
          start: 30,
          end: 32,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 6,
      },
    ],
    health: 50,
    body: {
      width: 0.6,
      height: 0.5,
      offsetY: 15,
    },
    moveOffsets: {
      left: 8,
      right: 25,
    },
    aggroBehavior: 'Melee',
    drops: [],
    collidableLayers: ['Sand'],
    canSail: true,
    attackConfig: {
      attackDamage: 5,
      attackRange: 20,
      chaseSpeed: 50,
    },
  },
  {
    name: 'Navy-Sailor',
    animFrameName: 'navy-sailor',
    placement: {
      // sand: 0.05,
    },
    body: {
      width: 0.25,
      height: 0.75,
      offsetY: 10,
      offsetX: 25,
    },
    moveOffsets: {
      left: 25,
      right: 40,
    },
    spawn: {
      lowerLimit: 1,
      upperLimit: 1,
    },
    animMapping: {
      walkFront: 'navy-sailor-walk-front',
      walkSide: 'navy-sailor-walk-side',
      walkBack: 'navy-sailor-walk-back',
      idleFront: 'navy-sailor-idle-front',
      idleSide: 'navy-sailor-idle-side',
      idleBack: 'navy-sailor-idle-back',
      dieFront: 'navy-sailor-die-front',
      dieSide: 'navy-sailor-die-front',
      dieBack: 'navy-sailor-die-back',
      hurtFront: 'navy-sailor-hurt-front',
      hurtSide: 'navy-sailor-hurt-side',
      hurtBack: 'navy-sailor-hurt-back',
      attackFront: 'navy-sailor-attack-front',
      attackSide: 'navy-sailor-attack-side',
      attackBack: 'navy-sailor-attack-back',
    },
    aggroBehavior: 'Melee',
    drops: [],
    collidableLayers: ['Grass', 'Ocean'],
    canSail: true,
    health: 150,
    attackConfig: {
      attackDamage: 20,
      attackRange: 35,
      chaseSpeed: 50,
    },
    animations: [
      {
        type: AnimationType.WALK_SIDE,
        key: 'navy-sailor-walk-side',
        frames: {
          start: 24,
          end: 27,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.IDLE_FRONT,
        key: 'navy-sailor-idle-front',
        frames: {
          start: 4,
          end: 7,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.IDLE_BACK,
        key: 'navy-sailor-idle-back',
        frames: {
          start: 12,
          end: 15,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.IDLE_SIDE,
        key: 'navy-sailor-idle-side',
        frames: {
          start: 20,
          end: 22,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.WALK_FRONT,
        key: 'navy-sailor-walk-front',
        frames: {
          start: 28,
          end: 31,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.WALK_BACK,
        key: 'navy-sailor-walk-back',
        frames: {
          start: 32,
          end: 35,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.ATTACK_SIDE,
        key: 'navy-sailor-attack-side',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.ATTACK_FRONT,
        key: 'navy-sailor-attack-front',
        frames: {
          start: 8,
          end: 11,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.ATTACK_BACK,
        key: 'navy-sailor-attack-back',
        frames: {
          start: 16,
          end: 19,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        type: AnimationType.HURT_FRONT,
        key: 'navy-sailor-hurt-front',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        type: AnimationType.HURT_BACK,
        key: 'navy-sailor-hurt-back',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        type: AnimationType.HURT_SIDE,
        key: 'navy-sailor-hurt-side',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        type: AnimationType.DIE_FRONT,
        key: 'navy-sailor-die-front',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        type: AnimationType.DIE_BACK,
        key: 'navy-sailor-die-back',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        type: AnimationType.DIE_SIDE,
        key: 'navy-sailor-die-side',
        frames: {
          start: 23,
          end: 23,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
    ],
  },
  {
    name: 'Crab',
    animFrameName: 'crab',
    placement: {
      sand: 0.01,
    },
    spawn: {
      lowerLimit: 1,
      upperLimit: 3,
    },
    animMapping: {
      walkFront: 'crab-walk-side',
      walkSide: 'crab-walk-front',
      walkBack: 'crab-walk-side',
      idleFront: 'crab-idle-side',
      idleSide: 'crab-idle-front',
      idleBack: 'crab-idle-side',
      dieFront: 'crab-die-side',
      dieSide: 'crab-die-front',
      dieBack: 'crab-die-side',
    },
    animations: [
      {
        type: AnimationType.IDLE_FRONT,
        key: 'crab-idle-front',
        frames: {
          start: 0,
          end: 2,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.WALK_FRONT,
        key: 'crab-walk-front',
        frames: {
          start: 4,
          end: 6,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.WALK_SIDE,
        key: 'crab-walk-side',
        frames: {
          start: 14,
          end: 16,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.IDLE_SIDE,
        key: 'crab-idle-side',
        frames: {
          start: 10,
          end: 12,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 10,
      },
      {
        type: AnimationType.HURT_FRONT,
        key: 'crab-hurt-front',
        frames: {
          start: 8,
          end: 8,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 10,
      },
      {
        type: AnimationType.DIE_FRONT,
        key: 'crab-die-front',
        frames: {
          start: 7,
          end: 9,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },
      {
        type: AnimationType.DIE_SIDE,
        key: 'crab-die-side',
        frames: {
          start: 16,
          end: 18,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 5,
      },
    ],
    health: 20,
    drops: ['Crab claw'],
    collidableLayers: ['Grass', 'Ocean'],
  },
  {
    name: 'Skeleton',
    animFrameName: 'skeleton',
    placement: {
      // sand: 0.05,
    },
    animMapping: {
      walkFront: 'skeleton-walk-front',
      walkSide: 'skeleton-walk-side',
      walkBack: 'skeleton-walk-back',
      idleFront: 'skeleton-idle-front',
      idleSide: 'skeleton-idle-side',
      idleBack: 'skeleton-idle-back',
      dieFront: 'skeleton-die-front',
      dieSide: 'skeleton-die-front',
      dieBack: 'skeleton-die-front',
      hurtFront: 'skeleton-hurt-front',
      hurtSide: 'skeleton-hurt-side',
      hurtBack: 'skeleton-hurt-back',
      attackFront: 'skeleton-attack-front',
      attackSide: 'skeleton-attack-side',
      attackBack: 'skeleton-attack-back',
    },
    animations: [
      {
        key: 'skeleton-walk-side',
        frames: {
          start: 0,
          end: 3,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-side',
        frames: {
          start: 4,
          end: 4,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-idle-front',
        frames: {
          start: 5,
          end: 8,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-front',
        frames: {
          start: 9,
          end: 9,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-walk-front',
        frames: {
          start: 10,
          end: 13,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-hurt-back',
        frames: {
          start: 14,
          end: 14,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 8,
      },
      {
        key: 'skeleton-walk-back',
        frames: {
          start: 15,
          end: 18,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-die-front',
        frames: {
          start: 19,
          end: 24,
          suffix: '.png',
        },
        repeat: 0,
        frameRate: 4,
      },
      {
        key: 'skeleton-idle-side',
        frames: {
          start: 25,
          end: 28,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-idle-back',
        frames: {
          start: 29,
          end: 32,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-side',
        frames: {
          start: 33,
          end: 36,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-front',
        frames: {
          start: 37,
          end: 40,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
      {
        key: 'skeleton-attack-back',
        frames: {
          start: 41,
          end: 44,
          suffix: '.png',
        },
        repeat: -1,
        frameRate: 8,
      },
    ],
    spawn: {
      lowerLimit: 1,
      upperLimit: 2,
    },
    health: 150,
    body: {
      width: 0.25,
      height: 0.75,
      offsetY: 10,
      offsetX: 25,
    },
    moveOffsets: {
      left: 25,
      right: 40,
    },
    aggroBehavior: 'Melee',
    drops: [],
    collidableLayers: ['Ocean'],
    canSail: true,
    attackConfig: {
      attackDamage: 15,
      attackRange: 30,
      chaseSpeed: 65,
    },
  },
]

export const ALL_EFFECTS = [
  {
    scale: {
      x: 3,
      y: 3,
    },
    ttl: 725,
    name: 'explosion-small',
    animation: {
      key: 'explosion-small-anim',
      frames: {
        start: 0,
        end: 8,
        suffix: '.png',
      },
      repeat: 0,
      frameRate: 15,
    },
  },
  {
    scale: {
      x: 5,
      y: 5,
    },
    ttl: 690,
    name: 'explosion-large',
    animation: {
      key: 'explosion-large-anim',
      frames: {
        start: 0,
        end: 7,
        suffix: '.png',
      },
      repeat: 0,
      frameRate: 15,
    },
  },
  {
    scale: {
      x: 3,
      y: 3,
    },
    ttl: 725,
    name: 'cannon-flash',
    animation: {
      key: 'cannon-flash-anim',
      frames: {
        start: 0,
        end: 8,
        suffix: '.png',
      },
      repeat: 0,
      frameRate: 15,
    },
  },
]

export const ALL_ITEMS: ItemConfig[] = [
  {
    name: 'Coconut',
    image: 'coconut',
    type: ItemTypes.consumable,
    effects: {
      health: 20,
    },
    description: 'A tasty coconut. Heals 20 HP',
  },
  {
    name: 'Banana',
    image: 'banana',
    type: ItemTypes.consumable,
    effects: {
      health: 10,
    },
    description: 'B-A-N-A-N-A-S. Heals 10 HP',
  },
  {
    name: 'Frond',
    image: 'palm-frond',
    type: ItemTypes.resource,
    description: 'Great for fanning',
  },
  {
    name: 'Wood',
    image: 'wood',
    type: ItemTypes.resource,
    description: 'Wood you like to build?',
    recipe: {
      Stick: 10,
    },
  },
  {
    name: 'Canvas',
    image: 'canvas',
    type: ItemTypes.resource,
    description: 'This world is but a canvas to our imagination',
    recipe: {
      Frond: 5,
    },
  },
  {
    name: 'Rope',
    image: 'rope',
    type: ItemTypes.resource,
    recipe: {
      Frond: 5,
    },
    description: "I'm at the end of my rope!",
  },
  {
    name: 'Sailboat Sail',
    image: 'sailboat-inventory-sails',
    type: ItemTypes.resource,
    description: 'Now all you need is a hull!',
    recipe: {
      Canvas: 1,
      Rope: 1,
      Wood: 10,
    },
  },
  {
    name: 'Sailboat Hull',
    image: 'sailboat-inventory-hull',
    type: ItemTypes.resource,
    description: 'The "hull" enchilada',
    recipe: {
      Wood: 20,
      'Iron Bar': 1,
    },
  },
  {
    name: 'Sailboat',
    image: 'sailboat-inventory',
    type: ItemTypes.ship,
    description: 'How the hell are you able to fit this in your pockets?!',
    inWorldImage: 'sailboat-preview',
    recipe: {
      'Sailboat Hull': 1,
      'Sailboat Sail': 1,
    },
  },
  {
    name: 'Crab claw',
    image: 'crabclaw',
    stats: {
      dropLength: 300,
    },
    description: "These claws ain't just for attracting mates!",
    type: ItemTypes.resource,
  },
  {
    name: 'Rock',
    image: 'rock',
    description: 'Dwayne Johnson',
    type: ItemTypes.resource,
  },
  {
    name: 'Stick',
    image: 'stick',
    description: "What's brown and sticky?",
    type: ItemTypes.resource,
  },
  {
    name: 'Iron Ore',
    image: 'iron-ore',
    description: 'My life for iron',
    type: ItemTypes.resource,
  },
  {
    name: 'Iron Bar',
    image: 'iron-bar',
    description: 'Do you see the iron-y?',
    type: ItemTypes.resource,
    recipe: {
      'Iron Ore': 3,
    },
  },
  {
    name: 'Stone Axe',
    inWorldImageSet: {
      up: 'axe-diag',
      down: 'axe-diag',
      left: 'axe',
      right: 'axe',
    },
    image: 'axe-inventory',
    description: 'And my axe!',
    recipe: {
      Rock: 2,
      Wood: 1,
    },
    stats: {
      damage: 15,
      'attack range': 20,
    },
    type: ItemTypes.weapon,
  },
  {
    name: 'Sword',
    inWorldImageSet: {
      up: 'sword-diag',
      down: 'sword-diag',
      left: 'sword',
      right: 'sword',
    },
    image: 'sword-inventory',
    description: 'Is the pen actually mightier?',
    recipe: {
      'Iron Bar': 10,
      Wood: 5,
    },
    stats: {
      damage: 35,
      'attack range': 30,
    },
    type: ItemTypes.weapon,
  },
  {
    name: 'Wood Club',
    inWorldImageSet: {
      up: 'wood-club-diag',
      down: 'wood-club-diag',
      left: 'wood-club',
      right: 'wood-club',
    },
    image: 'wood-club-inventory',
    description: 'Speak softly and carry a big stick',
    recipe: {
      Stick: 2,
    },
    stats: {
      damage: 10,
      'attack range': 15,
    },
    type: ItemTypes.weapon,
  },
]

export const CAPTAIN_TO_CREW_TYPE = {
  Skeleton: ['Skeleton', 'Monkey'],
}
