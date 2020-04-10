// Extarnal Libs

// External Files
import Account = require('../models/account')
import Block = require('../models/block')
import logService = require('../services/logger')

// Interfaces
import { IBlock } from '../interfaces/block'

// Logger setup
const logger = new logService('Block Controller')

class BlockController {
  public static async create(accountUUID: string, params: IBlock): Promise<string> {
    try {
      const _account = await Account.get(accountUUID)

      // Check if account has reached max number of blocks
      const _accountFull = await _account.checkIfFull()
      if (_accountFull) {
        throw new Error('max number of blocks reached')
      }

      // Create/update block for given account
      const { name } = params
      const _block = new Block(accountUUID, params)
      await _block.store()
      logger.info('Created new block')

      // Store block name in account entity
      await _account.addBlock(name)

      return `Your Pantry was updated with basket: ${name}!`
    } catch (error) {
      logger.error(`Block creation failed: ${error.message}`)
      throw error
    }
  }

  public static async get(accountUUID: string, name: string): Promise<any> {
    try {
      const _account = await Account.get(accountUUID)

      // Check if block exists
      const _block = await Block.get(accountUUID, name)

      if (!_block) {
        // Remove the block from the Account
        await _account.removeBlock(name)
        throw new Error(`${name} does not exist`)
      }

      logger.info('Block retrieved')

      return _block
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}`)
      throw error
    }
  }
}

export = BlockController
