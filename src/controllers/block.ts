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

      logger.info(`Creating new block in account: ${accountUUID}`)
      const _block = new Block(accountUUID, name, payload)
      await _block.store()

      return `Your Pantry was updated with basket: ${name}!`
    } catch (error) {
      logger.error(`Block creation failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async get(accountUUID: string, name: string): Promise<any> {
    try {
      let _block
      let _blockDetails
      const _account = await Account.get(accountUUID)

      try {
        _block = await Block.get(accountUUID, name)
        _blockDetails = _block.sanitize()
      } catch (error) {
        throw error
      }

      logger.info(`Refreshing TTL of account: ${accountUUID}`)
      await _account.refreshTTL()

      logger.info('Block retrieved')
      return _blockDetails
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async delete(accountUUID: string, name: string): Promise<string> {
    try {
      const _block = await Block.get(accountUUID, name)

      logger.info(`Removing block from account: ${accountUUID}`)
      await _block.delete()

      return `${name} was removed from your Pantry!`
    } catch (error) {
      logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }
}

export = BlockController
