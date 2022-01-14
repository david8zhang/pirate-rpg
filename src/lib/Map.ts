import Game from '~/scenes/Game'
import { ALL_HARVESTABLES, ALL_MOBS, Constants } from '~/utils/Constants'
import { MapGenerator } from './MapGenerator'
import { ObjectPlacer } from './ObjectPlacer'

export class Map {
  public mapSeed!: number
  private scene: Game
  public spawnPos: { x: number; y: number }
  public tileMap!: Phaser.Tilemaps.Tilemap
  public layers: Phaser.Tilemaps.TilemapLayer[] = []
  public perlinTileGrid!: number[][]
  public harvestables: any[]
  public spawners: any[]
  public currMapOffset: { x: number; y: number } = { x: 0, y: 0 }
  public removedHarvestables!: number[][]
  public enemyShipConfigs: any[] = []

  constructor(scene: Game) {
    this.scene = scene
    const mapSeed = this.getSavedMapSeed()
    this.mapSeed = mapSeed

    const currMapOffset = this.getSavedMapOffset()
    this.currMapOffset = currMapOffset

    const generatedMap = this.setupTileMap(mapSeed)
    this.spawnPos = Constants.getSpawnPosFromMap(generatedMap)
    this.configureRemovedHarvestables()

    this.harvestables = ObjectPlacer.placeHarvestablesFromTilemap(
      ALL_HARVESTABLES,
      generatedMap,
      this.perlinTileGrid,
      this.removedHarvestables
    )
    this.spawners = ObjectPlacer.placeMobsFromTilemap(ALL_MOBS, generatedMap, this.harvestables)
  }

  public configureRemovedHarvestables() {
    this.removedHarvestables = new Array(Constants.GAME_WIDTH)
      .fill(0)
      .map(() => new Array(Constants.GAME_HEIGHT).fill(0))
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)
      const removedHarvestablesList = saveFile.map.removedHarvestables
      removedHarvestablesList.forEach(([x, y]) => {
        this.removedHarvestables[x][y] = 1
      })
    }
  }

  public getRemovedHarvestablesAsFlatList() {
    const removedHarvestablesList: number[][] = []
    for (let i = 0; i < this.removedHarvestables.length; i++) {
      for (let j = 0; j < this.removedHarvestables[0].length; j++) {
        if (this.removedHarvestables[i][j]) {
          removedHarvestablesList.push([i, j])
        }
      }
    }
    return removedHarvestablesList
  }

  setupTileMap(seed: number) {
    const { tileMap, perlinTileGrid } = MapGenerator.getTileMap(seed, this.currMapOffset)
    this.perlinTileGrid = perlinTileGrid
    this.tileMap = this.scene.make.tilemap({
      height: Constants.GAME_HEIGHT,
      width: Constants.GAME_WIDTH,
      tileHeight: Constants.TILE_SIZE,
      tileWidth: Constants.TILE_SIZE,
    })
    const layerMapping = MapGenerator.splitIntoLayers(tileMap)
    const tileset = this.tileMap.addTilesetImage('beach-tiles', 'beach-tiles')
    const oceanLayer = this.createLayer('Ocean', layerMapping, tileset)
    const sandLayer = this.createLayer('Sand', layerMapping, tileset)
    const grassLayer = this.createLayer('Grass', layerMapping, tileset)
    oceanLayer.setCollisionByExclusion([-1])
    sandLayer.setCollisionByExclusion([-1])
    grassLayer.setCollisionByExclusion([-1])
    if (this.layers.length > 0) {
      this.layers.forEach((layer) => layer.destroy())
    }
    this.layers = []
    this.layers.push(oceanLayer)
    this.layers.push(sandLayer)
    this.layers.push(grassLayer)
    return tileMap
  }

  createLayer(layerName: string, layerMapping: any, tileset: Phaser.Tilemaps.Tileset) {
    const newLayer = this.tileMap.createBlankLayer(layerName, tileset)
    newLayer.putTilesAt(layerMapping[layerName], 0, 0)
    return newLayer
  }

  getSavedMapSeed(): number {
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)
      return saveFile.map.mapSeed
    }
    return Math.floor(Math.random() * 200)
  }

  getSavedMapOffset() {
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)
      return saveFile.map.offset
    }
    return { x: 0, y: 0 }
  }

  public addToRemovedHarvestables(tileX: number, tileY: number) {
    this.removedHarvestables[tileX][tileY] = 1
  }

  public getSpawnInOcean(
    posToSpawn: { x: number; y: number },
    generatedMap: number[][],
    toTransitionKey: string
  ) {
    const tileToSpawnIn = {
      col: Math.floor(posToSpawn.x / Constants.TILE_SIZE),
      row: Math.floor(posToSpawn.y / Constants.TILE_SIZE),
    }
    const tileCode = generatedMap[tileToSpawnIn.row][tileToSpawnIn.col]
    if (Constants.getLayer(tileCode) !== 'OCEAN') {
      switch (toTransitionKey) {
        case 'left':
        case 'right': {
          for (
            let i = Math.max(0, tileToSpawnIn.row - 20);
            i < Math.min(tileToSpawnIn.row + 20, Constants.GAME_HEIGHT);
            i++
          ) {
            const newTileCode = generatedMap[i][tileToSpawnIn.col]
            if (Constants.getLayer(newTileCode) === 'OCEAN') {
              const data = {
                x: tileToSpawnIn.col * Constants.TILE_SIZE,
                y: i * Constants.TILE_SIZE,
              }
              return data
            }
          }
        }
        case 'up':
        case 'down':
          for (
            let i = Math.max(0, tileToSpawnIn.col - 20);
            i < Math.min(tileToSpawnIn.col + 20, Constants.GAME_WIDTH);
            i++
          ) {
            const newTileCode = generatedMap[tileToSpawnIn.row][i]
            if (Constants.getLayer(newTileCode) === 'OCEAN') {
              return { y: tileToSpawnIn.row * Constants.TILE_SIZE, x: i * Constants.TILE_SIZE }
            }
          }
        default:
          return posToSpawn
      }
    }
    return posToSpawn
  }
}
