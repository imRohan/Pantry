import crypto = require('crypto')
import {
  IsNotEmpty,
  IsString,
  validate,
} from 'class-validator'


import { IPublicBlock } from '../interfaces/publicBlock'

import * as dataStore from '../services/dataStore'
import Block from './block'

class PublicBlock {

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
  public block: Block


  private readonly lifeSpanDays = Number(process.env.BLOCK_LIFESPAN)
  private readonly lifeSpan = Number(86400 * this.lifeSpanDays)

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
    await _publicBlock.saveToRedis()
    return _publicBlock
  }

  public async store(): Promise<string> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    await this.refreshBlock()
    await this.saveToRedis()
    return this.id
  }

  private async saveToRedis(): Promise<void> {
    const _stringifiedPublicBlock = this.generateRedisPayload()
    await dataStore.set(this.redisKey, _stringifiedPublicBlock, this.lifeSpan)
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
    await this.refreshBlock()
  }

  private async refreshBlock(): Promise<void> {
    try {
      this.block = await Block.get(this.accountUUID, this.blockName)
    } catch {
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
}

export default PublicBlock
