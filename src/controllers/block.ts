// Extarnal Libs

// External Files
import Block from '../models/block'
import logService from '../services/logger'
import { IBlockPublic } from '../interfaces/block'

// Logger setup
const logger = new logService('Block Controller')

class BlockController {
  public static async create(accountUUID: string, name: string, payload: JSON): Promise<IBlockPublic> {
    try {
      const _block = new Block(accountUUID, name, payload)
      await _block.verifyAccountNotFull()
      await _block.store()

      logger.info(`Block ${name} created in account: ${accountUUID}`)
      const _blockDetails = _block.sanitize()
      return _blockDetails
    } catch (error) {
      logger.error(`Block creation failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async get(accountUUID: string, name: string): Promise<IBlockPublic> {
    try {
      const _block = await Block.get(accountUUID, name)

      logger.info(`Block ${name} retrieved from account: ${accountUUID}`)
      const _blockDetails = _block.sanitize()
      return _blockDetails
    } catch (error) {
      logger.error(`Block retrieval failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async update(accountUUID: string, name: string, data: JSON): Promise<IBlockPublic> {
    try {
      const _block = await Block.get(accountUUID, name)
      await _block.update(data)

      logger.info(`Block ${name} updated in account: ${accountUUID}`)
      const _blockDetails = _block.sanitize()
      return _blockDetails
    } catch (error) {
      logger.error(`Block update failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }

  public static async delete(accountUUID: string, name: string): Promise<void> {
    try {
      const _block = await Block.get(accountUUID, name)
      await _block.delete()
      logger.info(`Block ${name} was successfully removed from account: ${accountUUID}`)
    } catch (error) {
      logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`)
      throw error
    }
  }
}

export default BlockController
