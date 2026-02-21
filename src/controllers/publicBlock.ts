import PublicBlock from '../models/publicBlock'
import logService from '../services/logger'

import { IBlockPublic } from '../interfaces/block'

// Logger setup
const logger = new logService('Public Block Controller')

class PublicBlockController {
  public static async create(pantryID: string, basketName: string): Promise<string> {
    try {
      const _publicBlock = new PublicBlock(pantryID, basketName)
      const _publicBlockUUID = await _publicBlock.store()

      logger.info(`Public Block created: ${_publicBlockUUID}`)
      return _publicBlockUUID
    } catch (error) {
      logger.error(`Public Block creation failed: ${error.message}`)
      throw error
    }
  }

  public static async get(id: string): Promise<IBlockPublic> {
    try {
      const _publicBlock = await PublicBlock.get(id)

      logger.info(`Public Block retrieved: ${id}`)
      return _publicBlock.sanitizedBlock()
    } catch (error) {
      logger.error(`Public Block retrieval failed: ${error.message}`)
      throw error
    }
  }
}

export default PublicBlockController
