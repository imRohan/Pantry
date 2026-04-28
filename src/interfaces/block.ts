export interface IBlock {
  accountUUID: string,
  name: string,
  payload: any,
  createdAt: Date,
  updatedAt: Date | null,
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
  updatedAt: string | null
}

export interface IBlockPublic {
  [key: string]: unknown,
  _metadata?: IBlockMetadata
}
