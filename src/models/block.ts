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
  public static async get(accountUUID: string, name: string): Promise<any> {
    try {
      const _blockKey = Block.generateRedisKey(accountUUID, name)

      const _stringifiedBlock = await dataStore.get(_blockKey)

      if (!_stringifiedBlock) {
        throw new Error(`${name} does not exist`)
      }

      const _blockParams = Block.convertRedisPayload(_stringifiedBlock)
      const _blockObject = new Block(accountUUID, name, _blockParams)

      const _blockSanitized = _blockObject.sanitize()
      return _blockSanitized
    } catch (error) {
      throw new Error(`failed to get block: ${error.message}`)
    }
  }

  private static convertRedisPayload(stringifiedBlock: string): IBlock {
    try {
      const _block = JSON.parse(stringifiedBlock)
      return _block
    } catch (error) {
      throw new Error(`failed to convert redis payload: ${error.message}`)
    }
  }

  private static generateRedisKey(accountUUID: string, name: string): string {
    try {
      return `account:${accountUUID}::block:${name}`
    } catch (error) {
      throw new Error(`Block - failed to generate rkey: ${error.message}`)
    }
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
    try {
      // Validate the account object
      const _errors = await validate(this)
      if (_errors.length > 0) {
        throw new Error(`Validation failed: ${_errors}`)
      }

      const _blockKey = Block.generateRedisKey(this.accountUUID, this.name)
      const _stringifiedBlock = this.generateRedisPayload()

      await dataStore.set(_blockKey, _stringifiedBlock, this.lifeSpan)
    } catch (error) {
      throw new Error(`Block - failed to store block: ${error.message}`)
    }
  }

  public sanitize(): any {
    try {
      return this.payload
    } catch (error) {
      throw new Error(`failed to sanitize block: ${error.message}`)
    }
  }

  private generateRedisPayload(): string {
    return JSON.stringify(this.payload)
  }
}

export = Block
