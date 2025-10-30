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
      logger.info(`Creating block ${name} in account: ${accountUUID}`)

      const _account = await Account.get(accountUUID)
      const _accountFull = await _account.checkIfFull()

      if (_accountFull) {
        const _errorMessage = 'max number of baskets reached'
        throw new Error(_errorMessage)
      }

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
      logger.info(`Retrieving block: ${name} in account: #{accountUUID}`)

      const _block = await Block.get(accountUUID, name)
      const _blockDetails = _block.sanitize()

      return _blockDetails
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async update(accountUUID: string, name: string, data: any): Promise<any> {
    try {
      logger.info(`Updating block ${name} in account: ${accountUUID}`)

      const _block = await Block.get(accountUUID, name)

      await _block.update(data)
      const _blockDetails = _block.sanitize()

      return _blockDetails
    } catch (error) {
      logger.error(`Block update failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async delete(accountUUID: string, name: string): Promise<string> {
    try {
      logger.info(`Removing block ${name} from account: ${accountUUID}`)

      const _block = await Block.get(accountUUID, name)
      await _block.delete()

      return `${name} was removed from your Pantry!`
    } catch (error) {
      logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }
}

export default BlockController
