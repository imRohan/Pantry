// Extarnal Libs
import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString, validate } from 'class-validator'
import redis = require('redis')
import { promisify } from 'util'

// External Files

// Interfaces
import { IBlock } from '../interfaces/block'

class Block {
  public static async get(accountUUID: string, name: string): Promise<any> {
    try {
      const _client = redis.createClient()
      const _getAsync = promisify(_client.get).bind(_client)

      const _blockKey = Block.generateRedisKey(accountUUID, name)
      const _stringifiedBlock = await _getAsync(_blockKey)
      _client.quit()

      if (!_stringifiedBlock) {
        throw new Error(`${name} does not exist`)
      }

      const _block = Block.convertRedisPayload(_stringifiedBlock)
      const _blockSanitized = Block.sanitize(_block)
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

  private static sanitize(block: IBlock): any {
    try {
      const { payload } = block
      return payload
    } catch (error) {
      throw new Error(`failed to sanitize block: ${error.message}`)
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
  public payload: any

  // Constants
  private readonly lifeSpan = 432000

  constructor(accountUUID: string, params: IBlock) {
    const { name, payload } = params
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

      const _client = redis.createClient()
      const _setAsync = promisify(_client.set).bind(_client)

      const _blockKey = Block.generateRedisKey(this.accountUUID, this.name)
      const _stringifiedBlock = this.generateRedisPayload()
      await _setAsync(_blockKey, _stringifiedBlock, 'EX', this.lifeSpan)
      _client.quit()
    } catch (error) {
      throw new Error(`Block - failed to store block: ${error.message}`)
    }
  }

  private generateRedisPayload(): string {
    const _blockDetails: IBlock = {
      accountUUID: this.accountUUID,
      name: this.name,
      payload: this.payload,
    }
    return JSON.stringify(_blockDetails)
  }
}

export = Block
