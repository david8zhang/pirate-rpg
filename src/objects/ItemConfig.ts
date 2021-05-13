export enum ItemTypes {
  weapon = 'WEAPON',
  armor = 'ARMOR',
  resource = 'RESOURCE',
  particle = 'PARTICLE',
  structure = 'STRUCTURE',
  transport = 'TRANSPORT',
}

export interface ItemConfig {
  name: string
  image: string
  description: string
  type: ItemTypes
  inWorldImage?: string
  recipe?: any
  stats?: any
}
