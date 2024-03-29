export interface IBlock {
  accountUUID: string,
  name: string,
  payload: any,
}

export interface IBlockInfo {
  name: string,
  ttl: number,
}

export interface IBlockRequestParams {
  pantryID: string,
  basketName: string,
}
