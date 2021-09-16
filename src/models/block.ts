// Extarnal Libs
import {
  IsNotEmpty,
  IsObject,
  IsString,
  validate,
} from 'class-validator'
import merge = require('deepmerge')

// External Files
import { IsValidPayloadSize } from '../decorators/block'
import * as dataStore from '../services/dataStore'

// Interfaces
import { IBlock } from '../interfaces/block'

class Block {

  @IsNotEmpty()
  @IsString()
  public accountUUID: string
  @IsNotEmpty()
  @IsString()
  public name: string
  @IsNotEmpty()
  @IsObject()
  @IsValidPayloadSize()
  public payload: any

  // Constants
  private readonly lifeSpanDays = Number(process.env.BLOCK_LIFESPAN)
  private readonly lifeSpan = Number(86400 * this.lifeSpanDays)

  public constructor(accountUUID: string, name, payload: any) {
    this.name = name
    this.payload = payload
    this.accountUUID = accountUUID
  }

  public static async get(accountUUID: string, name: string): Promise<Block> {
    const _blockKey = Block.generateRedisKey(accountUUID, name)
    const _stringifiedBlock = await dataStore.get(_blockKey)

    if (!_stringifiedBlock) {
      throw new Error(`${name} does not exist`)
    }

    const _blockContents = Block.convertRedisPayload(_stringifiedBlock)
    const { payload } = _blockContents

    const _block = new Block(accountUUID, name, payload)

    await _block.refreshTTL()

    return _block
  }

  private static convertRedisPayload(stringifiedBlock: string): IBlock {
    const _block = JSON.parse(stringifiedBlock)
    return _block
  }

  private static generateRedisKey(accountUUID: string, name: string): string {
    return `account:${accountUUID}::block:${name}`
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

  public async update(newData: any): Promise<any> {
    const _updatedPayload = merge(this.payload, newData)
    this.payload = _updatedPayload
    await this.store()

    return(_updatedPayload)
  }

  public async delete(): Promise<void> {
    const _blockKey = Block.generateRedisKey(this.accountUUID, this.name)
    await dataStore.remove(_blockKey)
  }

  public async refreshTTL(): Promise<void> {
    await this.store()
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

export default Block
