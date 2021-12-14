import { Direction } from '~/characters/Player'
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

  constructor(scene: Game) {
    this.scene = scene
    const mapSeed = this.getSavedMapSeed()
    this.mapSeed = mapSeed
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
      console.log(removedHarvestablesList)
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
    const newLayer = this.tileMap.createBlankLayer(layerName, tileset, 0, 0)
    newLayer.putTilesAt(layerMapping[layerName], 0, 0)
    return newLayer
  }

  getSavedMapSeed(): number {
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)
      return saveFile.mapSeed
    }
    return Math.floor(Math.random() * 200)
  }

  handlePlayerCollideBounds() {
    const leftBorder = 0
    const rightBorder = Constants.BG_WIDTH
    const downBorder = Constants.BG_HEIGHT
    const upBorder = 0
    const bufferZone = 20

    let spawnBuffer = 50
    if (this.scene.player.ship) {
      const shipDirection = this.scene.player.ship.currDirection
      const height = this.scene.player.ship.hullSprite.body.height
      const width = this.scene.player.ship.hullSprite.body.width
      spawnBuffer +=
        shipDirection === Direction.UP || shipDirection === Direction.DOWN ? height : width
    }
    const positionToSpawn = {
      left: { x: rightBorder - spawnBuffer, y: this.scene.player.y },
      right: { x: leftBorder + spawnBuffer, y: this.scene.player.y },
      up: { x: this.scene.player.x, y: downBorder - spawnBuffer },
      down: { x: this.scene.player.x, y: upBorder + spawnBuffer },
    }
    let toTransitionMapKey = ''
    if (this.scene.player.x <= leftBorder + bufferZone) {
      this.currMapOffset.y -= 1
      toTransitionMapKey = 'left'
    } else if (this.scene.player.x >= rightBorder - bufferZone) {
      this.currMapOffset.y += 1
      toTransitionMapKey = 'right'
    } else if (this.scene.player.y <= upBorder + bufferZone) {
      this.currMapOffset.x -= 1
      toTransitionMapKey = 'up'
    } else if (this.scene.player.y >= downBorder - bufferZone) {
      this.currMapOffset.x += 1
      toTransitionMapKey = 'down'
    }
    const posToSpawn = positionToSpawn[toTransitionMapKey]
    if (this.scene.player.ship) {
      this.scene.player.ship.setPosition(posToSpawn.x, posToSpawn.y)
    } else {
      this.scene.player.setPosition(posToSpawn.x, posToSpawn.y)
    }
    const generatedMap = this.setupTileMap(this.mapSeed)
    this.scene.clearHarvestables()
    this.scene.clearSpawnersAndMobs()
    this.scene.clearItemPool()
    this.harvestables = ObjectPlacer.placeHarvestablesFromTilemap(
      ALL_HARVESTABLES,
      generatedMap,
      this.perlinTileGrid,
      this.removedHarvestables
    )
    this.spawners = ObjectPlacer.placeMobsFromTilemap(ALL_MOBS, generatedMap, this.harvestables)
  }

  public addToRemovedHarvestables(tileX: number, tileY: number) {
    this.removedHarvestables[tileX][tileY] = 1
  }
}
