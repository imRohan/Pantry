export interface IAccountBase {
  name: string,
  description: string,
  contactEmail: string,
}

export interface IAccountPrivate extends IAccountBase {
  blocks: string[],
  maxNumberOfBlocks: number,
  notifications: boolean,
  uuid?: string,
}
