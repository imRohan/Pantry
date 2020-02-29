// Extarnal Libs
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  validate,
} from 'class-validator'
import uuidv4 = require('uuid/v4')

// External Files
import DataStore = require('../services/dataStore')

// Interfaces
import { IAccountBase, IAccountPrivate } from '../interfaces/account'

class Account {
  public static async checkIfExists(uuid: string): Promise<boolean> {
    try {
      const _account = await Account.get(uuid)
      return _account ? true : false
    } catch (error) {
      return false
    }
  }

  public static async get(uuid: string): Promise<Account> {
    try {
      const _accountKey = Account.generateRedisKey(uuid)

      const _client = new DataStore()
      const _stringifiedAccount = await _client.get(_accountKey)

      if (!_stringifiedAccount) {
        throw new Error(`pantry with id: ${uuid} not found`)
      }

      const _accountParams = Account.convertRedisPayload(_stringifiedAccount)
      const _accountObject = new Account(_accountParams)

      return _accountObject
    } catch (error) {
      throw error
    }
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccountPrivate {
    try {
      const _account = JSON.parse(stringifiedAccount)
      return _account
    } catch (error) {
      throw new Error(`failed to convert payload: ${error.message}`)
    }
  }

  private static generateRedisKey(uuid: string): string {
    try {
      return `account:${uuid}`
    } catch (error) {
      throw new Error(`failed to generate rkey: ${error.message}`)
    }
  }

  @IsNotEmpty()
  @IsString()
  private name: string
  @IsNotEmpty()
  @IsString()
  private description: string
  @IsNotEmpty()
  @IsString()
  private contactEmail: string
  @IsNotEmpty()
  @IsBoolean()
  private notifications: boolean
  @IsNotEmpty()
  @IsNumber()
  private maxNumberOfBlocks: number
  @IsNotEmpty()
  @IsArray()
  private blocks: string[]
  @IsUUID('4')
  private uuid: string

  // Constants
  private readonly lifeSpan = Number(86400 * 5)
  private readonly defaultMaxNumberOfBlocks = 50

  constructor(params: any) {
    const { name, description, contactEmail, notifications, blocks, uuid } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? false
    this.maxNumberOfBlocks = this.defaultMaxNumberOfBlocks
    this.blocks = blocks ?? []
    this.uuid = uuid ?? uuidv4()
  }

  public async store(): Promise<string> {
    try {
      // Validate the account object
      const _errors = await validate(this)
      if (_errors.length > 0) {
        throw new Error(`Validation failed: ${_errors}`)
      }

      const _accountKey = Account.generateRedisKey(this.uuid)
      const _stringifiedAccount = this.generateRedisPayload()

      const _client = new DataStore()
      await _client.set(_accountKey, _stringifiedAccount, this.lifeSpan)

      return this.uuid
    } catch (error) {
      throw error
    }
  }

  public sanitize(): IAccountBase {
    try {
      const _sanitizedItems = {
        name: this.name,
        description: this.description,
        contactEmail: this.contactEmail,
        blocks: this.blocks,
        maxNumberOfBlocks: this.maxNumberOfBlocks,
      }
      return _sanitizedItems
    } catch (error) {
      throw new Error(`failed to sanitize: ${error.message}`)
    }
  }

  public async addBlock(blockName: string): Promise<void> {
    try {
      const _currentBlocks = this.blocks
      const _updatedBlocks = [..._currentBlocks, blockName]

      this.blocks = _updatedBlocks
      await this.store()
    } catch (error) {
      throw new Error(`failed to add block: ${error.message}`)
    }
  }

  public async removeBlock(blockName: string): Promise<void> {
    try {
      const _updatedBlocks = this.blocks.filter((name) => name !== blockName)

      this.blocks = _updatedBlocks
      await this.store()
    } catch (error) {
      throw new Error(`failed to remove block: ${error.message}`)
    }
  }

  public checkIfFull(): boolean {
    try {
      const _isFull = this.blocks.length === this.maxNumberOfBlocks
      return _isFull
    } catch (error) {
      throw new Error(`failed to remove block: ${error.message}`)
    }
  }

  private generateRedisPayload(): string {
    const _accountDetails: IAccountPrivate = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      notifications: this.notifications,
      maxNumberOfBlocks: this.maxNumberOfBlocks,
      blocks: this.blocks,
      uuid: this.uuid,
    }
    return JSON.stringify(_accountDetails)
  }
}

export = Account
