// Extarnal Libs

// External Files
import Account = require('../models/account')
import Block = require('../models/block')
import logService = require('../services/logger')

// Logger setup
const logger = new logService('Block Controller')

class BlockController {
  public static async create(accountUUID: string, name: string, payload: any): Promise<string> {
    try {
      const _account = await Account.get(accountUUID)

      // Check if account has reached max number of blocks
      const _accountFull = await _account.checkIfFull()
      if (_accountFull) {
        throw new Error('max number of blocks reached')
      }

      logger.info('Creating new block in account: ${accountUUID}')
      const _block = new Block(accountUUID, name, payload)
      await _block.store()

      logger.info(`Adding block to account: ${accountUUID}`)
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

      const _block = await Block.get(accountUUID, name)
      const _blockDetails = _block.sanitize()

      logger.info(`Refreshing TTL of account: ${accountUUID}`)
      await _account.refreshTTL()

      logger.info('Block retrieved')
      return _blockDetails
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}`)
      throw error
    }
  }

  public static async delete(accountUUID: string, name: string): Promise<string> {
    try {
      const _account = await Account.get(accountUUID)

      await Block.get(accountUUID, name)

      logger.info(`Deleting block in account: ${accountUUID}`)
      await Block.delete(accountUUID, name)

      logger.info(`Removing block from account: ${accountUUID}`)
      await _account.removeBlock(name)

      return `${name} was removed from your Pantry!`
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}`)
      throw error
    }
  }
}

export = BlockController
