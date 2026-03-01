export interface IBlock {
  accountUUID: string,
  name: string,
  payload: any,
  createdAt: Date,
  updatedAt: Date,
}

export interface IBlockInfo {
  name: string,
  ttl: number,
}

export interface IBlockRequestParams {
  pantryID: string,
  basketName: string,
}

export interface IBlockMetadata {
  createdAt: string
  updatedAt: string
}

export interface IBlockPublic {
  [key: string]: unknown,
  _metadata: IBlockMetadata
}
