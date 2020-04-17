// Extarnal Libs
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  validate,
} from 'class-validator'
import uuidv4 = require('uuid/v4')

// External Files
import dataStore = require('../services/dataStore')

// Interfaces
import { IAccountPrivate, IAccountPublic } from '../interfaces/account'

class Account {
  public static async get(uuid: string): Promise<Account> {
    const _accountKey = Account.generateRedisKey(uuid)

    const _stringifiedAccount = await dataStore.get(_accountKey)

    if (!_stringifiedAccount) {
      throw new Error(`pantry with id: ${uuid} not found`)
    }

    const _accountParams = Account.convertRedisPayload(_stringifiedAccount)
    const _accountObject = new Account(_accountParams)

    return _accountObject
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccountPrivate {
    const _account = JSON.parse(stringifiedAccount)
    return _account
  }

  private static generateRedisKey(uuid: string): string {
    return `account:${uuid}`
  }

  @IsNotEmpty()
  @IsArray()
  public blocks: string[]

  @IsNotEmpty()
  @IsString()
  private name: string
  @IsNotEmpty()
  @IsString()
  private description: string
  @IsNotEmpty()
  @IsEmail()
  private contactEmail: string
  @IsNotEmpty()
  @IsBoolean()
  private notifications: boolean
  @IsNotEmpty()
  @IsNumber()
  private maxNumberOfBlocks: number
  @IsUUID('4')
  private uuid: string

  // Constants
  private readonly lifeSpanDays = Number(process.env.ACCOUNT_LIFESPAN)
  private readonly lifeSpan = Number(86400 * this.lifeSpanDays)
  private readonly defaultMaxNumberOfBlocks = 50

  constructor(params: any) {
    const { name, description, contactEmail, notifications, blocks, uuid, maxNumberOfBlocks } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? false
    this.maxNumberOfBlocks = maxNumberOfBlocks ?? this.defaultMaxNumberOfBlocks
    this.blocks = blocks ?? []
    this.uuid = uuid ?? uuidv4()
  }

  public async store(): Promise<string> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _accountKey = Account.generateRedisKey(this.uuid)
    const _stringifiedAccount = this.generateRedisPayload()

    await dataStore.set(_accountKey, _stringifiedAccount, this.lifeSpan)

    return this.uuid
  }

  public sanitize(): IAccountPublic {
    const _sanitizedItems: IAccountPublic = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      baskets: this.blocks,
    }

    return _sanitizedItems
  }

  public async addBlock(blockName: string): Promise<void> {
    const _currentBlocks = this.blocks.filter((name) => name !== blockName)
    const _updatedBlocks = [..._currentBlocks, blockName]

    this.blocks = _updatedBlocks
    await this.store()
  }

  public async removeBlock(blockName: string): Promise<void> {
    const _updatedBlocks = this.blocks.filter((name) => name !== blockName)

    this.blocks = _updatedBlocks
    await this.store()
  }

  public checkIfFull(): boolean {
    const _isFull = this.blocks.length === this.maxNumberOfBlocks
    return _isFull
  }

  public async delete(): Promise<void> {
    const _accountKey = Account.generateRedisKey(this.uuid)
    await dataStore.delete(_accountKey)
  }

  public async refreshTTL(): Promise<void> {
    await this.store()
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
