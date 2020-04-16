// Extarnal Libs
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  validate,
} from 'class-validator'

// External Files
import { IsValidPayloadSize } from '../decorators/block'
import dataStore = require('../services/dataStore')

// Interfaces
import { IBlock } from '../interfaces/block'

class Block {
  public static async get(accountUUID: string, name: string): Promise<Block> {
    const _blockKey = Block.generateRedisKey(accountUUID, name)

    const _stringifiedBlock = await dataStore.get(_blockKey)

    if (!_stringifiedBlock) {
      throw new Error(`${name} does not exist`)
    }

    const _blockContents = Block.convertRedisPayload(_stringifiedBlock)
    const { payload } = _blockContents

    const _block = new Block(accountUUID, name, payload)

    return _block
  }

  private static convertRedisPayload(stringifiedBlock: string): IBlock {
    const _block = JSON.parse(stringifiedBlock)
    return _block
  }

  private static generateRedisKey(accountUUID: string, name: string): string {
    return `account:${accountUUID}::block:${name}`
  }

  @IsNotEmpty()
  @IsString()
  public accountUUID: string
  @IsNotEmpty()
  @IsString()
  public name: string
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  @IsValidPayloadSize()
  public payload: any

  // Constants
  private readonly lifeSpanDays = Number(process.env.BLOCK_LIFESPAN)
  private readonly lifeSpan = Number(86400 * this.lifeSpanDays)

  constructor(accountUUID: string, name, payload: any) {
    this.name = name
    this.payload = payload
    this.accountUUID = accountUUID
  }

  public async store(): Promise<void> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _blockKey = Block.generateRedisKey(this.accountUUID, this.name)
    const _stringifiedBlock = this.generateRedisPayload()

    await dataStore.set(_blockKey, _stringifiedBlock, this.lifeSpan)
  }

  public async delete(): Promise<void> {
    const _blockKey = Block.generateRedisKey(this.accountUUID, this.name)
    await dataStore.delete(_blockKey)
  }

  public sanitize(): any {
    return this.payload
  }

  private generateRedisPayload(): string {
    const _payload: IBlock = {
      accountUUID: this.accountUUID,
      name: this.name,
      payload: this.payload,
    }
    return JSON.stringify(_payload)
  }
}

export = Block
