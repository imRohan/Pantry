import crypto = require('crypto')
import {
  IsNotEmpty,
  IsString,
  validate,
} from 'class-validator'


import { IPublicBlock } from '../interfaces/publicBlock'
import { IBlockPublic } from '../interfaces/block'

import * as dataStore from '../services/dataStore'
import Block from './block'

class PublicBlock {
  public static readonly lifeSpanDays = Number(process.env.BLOCK_LIFESPAN)
  public static readonly lifeSpan = Number(86400 * this.lifeSpanDays)

  @IsNotEmpty()
  @IsString()
  private accountUUID: string
  @IsNotEmpty()
  @IsString()
  private blockName: string
  @IsNotEmpty()
  @IsString()
  private id: string
  @IsNotEmpty()
  @IsString()
  private redisKey: string
  @IsNotEmpty()
  private block: Block

  public constructor(accountUUID: string, blockName: string, id: string = null) {
    this.accountUUID = accountUUID
    this.blockName = blockName
    this.id = id ?? this.generateHash()
    this.redisKey = `public_block:${this.id}`
    this.block = null
  }

  public static async get(id: string): Promise<PublicBlock> {
    const _publicBlock = new PublicBlock(null, null, id)
    await _publicBlock.hydrate()
    await _publicBlock.refreshTTL()
    return _publicBlock
  }

  public static async getTotalNumber(): Promise<number> {
    const _keysPerScan = 10000
    const _pattern = '*public_block:*'
    let _total = 0
    let _nextCursor = 0

    do {
      const [_cursor, _results] = await dataStore.scan(_nextCursor, _pattern, _keysPerScan)
      _total += _results.length
      _nextCursor = parseInt(_cursor, 10)
    } while (_nextCursor !== 0)

    return _total
  }

  public async store(): Promise<string> {
    await this.hydrateBlock()

    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _stringifiedPublicBlock = this.generateRedisPayload()
    await dataStore.set(this.redisKey, _stringifiedPublicBlock, PublicBlock.lifeSpan)

    return this.id
  }

  public sanitizedBlock(): IBlockPublic {
    const _sanitizedBlock = this.block.sanitize()
    delete _sanitizedBlock._metadata
    return _sanitizedBlock
  }

  private async hydrate(): Promise<void> {
    const _stringifiedPublicBlock = await dataStore.get(this.redisKey)

    if (!_stringifiedPublicBlock) {
      throw new Error(`${this.id} does not exist`)
    }
    const _publicBlockContents: IPublicBlock = JSON.parse(_stringifiedPublicBlock)
    const { accountUUID, blockName } = _publicBlockContents

    this.accountUUID = accountUUID
    this.blockName = blockName
    await this.hydrateBlock()
  }

  private async hydrateBlock(): Promise<void> {
    try {
      this.block = await Block.get(this.accountUUID, this.blockName)
    } catch (_error) {
      throw new Error('basket not found, please contact the Pantry owner')
    }
  }

  private generateHash(): string {
    const _key = `${this.accountUUID}${this.blockName}`
    const _hash = crypto.createHash('md5').update(_key).digest('hex')
    return _hash
  }

  private generateRedisPayload(): string {
    const _publicBlock: IPublicBlock = {
      accountUUID: this.accountUUID,
      blockName: this.blockName,
      id: this.id,
    }
    return JSON.stringify(_publicBlock)
  }

  private async refreshTTL(): Promise<void> {
    await dataStore.refreshTTL(this.redisKey, PublicBlock.lifeSpan)
  }
}

export default PublicBlock
