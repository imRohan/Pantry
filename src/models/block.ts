// Extarnal Libs
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsDate,
  IsOptional,
  validate,
} from 'class-validator'
import merge = require('deepmerge')

// External Files
import { IsValidPayloadSize } from '../decorators/block'
import * as dataStore from '../services/dataStore'

// Interfaces
import { IBlock, IBlockMetadata, IBlockPublic } from '../interfaces/block'
import Account from './account'

class Block {
  public static readonly lifeSpanDays = Number(process.env.BLOCK_LIFESPAN)
  public static readonly lifeSpan = Number(86400 * this.lifeSpanDays)

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
  @IsNotEmpty()
  public account: Account
  @IsNotEmpty()
  @IsDate()
  public createdAt: Date
  @IsOptional()
  @IsDate()
  public updatedAt: Date
  @IsNotEmpty()
  @IsString()
  private redisKey: string

  public constructor(accountUUID: string, name: string, payload: JSON = null,
                     createdAt: Date = new Date()) {
    this.name = name
    this.payload = payload
    this.accountUUID = accountUUID
    this.createdAt = createdAt
    this.account = null
    this.updatedAt = null
    this.redisKey = `account:${this.accountUUID}::block:${this.name}`
  }

  public static async get(accountUUID: string, name: string): Promise<Block> {
    const _block = new Block(accountUUID, name)
    await _block.hydrate()
    await _block.refreshTTL()
    return _block
  }

  public async store(): Promise<void> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _stringifiedBlock = this.generateRedisPayload()
    await dataStore.set(this.redisKey, _stringifiedBlock, Block.lifeSpan)
  }

  public async update(newData: JSON): Promise<JSON> {
    const _updatedPayload = merge(this.payload, newData)
    this.payload = _updatedPayload
    this.updatedAt = new Date()
    await this.store()

    return _updatedPayload
  }

  public async delete(): Promise<void> {
    await dataStore.remove(this.redisKey)
  }

  public async refreshTTL(): Promise<void> {
    await dataStore.refreshTTL(this.redisKey, Block.lifeSpan)
  }

  public sanitize(): IBlockPublic {
    return { ...this.payload, _metadata: this.metadata() }
  }

  public async verifyAccountNotFull(): Promise<void> {
    await this.hydrateAccount()
    await this.account.verifyIfFull()
  }

  private metadata(): IBlockMetadata {
    return {
      createdAt: this.createdAt.toUTCString(),
      updatedAt: this.updatedAt ? this.updatedAt.toUTCString() : null,
    }
  }

  private generateRedisPayload(): string {
    const _payload: IBlock = {
      accountUUID: this.accountUUID,
      name: this.name,
      payload: this.payload,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
    return JSON.stringify(_payload)
  }

  private async hydrate(): Promise<void> {
    await this.hydrateAccount()
    const _stringifiedBlock = await dataStore.get(this.redisKey)

    if (!_stringifiedBlock) {
      throw new Error(`${this.name} does not exist`)
    }

    const _blockContents: IBlock = JSON.parse(_stringifiedBlock)
    const { payload, createdAt, updatedAt } = _blockContents
    this.payload = payload
    this.createdAt = createdAt ? new Date(createdAt) : new Date()
    this.updatedAt = updatedAt ? new Date(updatedAt) : null
  }

  private async hydrateAccount(): Promise<void> {
    this.account = await Account.get(this.accountUUID)
  }
}

export default Block
