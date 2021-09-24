// Extarnal Libs

// External Files
import Account from '../models/account'
import Block from '../models/block'
import logService from '../services/logger'

// Logger setup
const logger = new logService('Block Controller')

class BlockController {
  public static async create(accountUUID: string, name: string, payload: any): Promise<string> {
    try {
      const _account = await Account.get(accountUUID)

      // Check if account has reached max number of blocks
      const _accountFull = await _account.checkIfFull()
      if (_accountFull) {
        const _errorMessage = 'max number of baskets reached'
        await _account.saveError(_errorMessage)
        throw new Error(_errorMessage)
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
        await _account.saveError(error.message)
        throw error
      }

      logger.info('Block retrieved')
      return _blockDetails
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async update(accountUUID: string, name: string, data: any): Promise<any> {
    try {
      const _block = await BlockController.fetchBlock(accountUUID, name)

      await _block.update(data)
      const _blockDetails = _block.sanitize()

      logger.info(`Updating block ${name} in account: ${accountUUID}`)
      return _blockDetails
    } catch (error) {
      logger.error(`Block update failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async delete(accountUUID: string, name: string): Promise<string> {
    try {
      const _block = await BlockController.fetchBlock(accountUUID, name)

      logger.info(`Removing block from account: ${accountUUID}`)
      await _block.delete()

      return `${name} was removed from your Pantry!`
    } catch (error) {
      logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  private static async fetchBlock(accountUUID: string, name: string): Promise<Block> {
    const _account = await Account.get(accountUUID)

    try {
      const _block = await Block.get(accountUUID, name)

      return _block
    } catch (error) {
      await _account.saveError(error.message)
      throw error
    }
  }
}

export default BlockController
