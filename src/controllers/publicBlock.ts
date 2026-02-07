import PublicBlock from '../models/publicBlock'
import logService from '../services/logger'

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

  public static async get(id: string): Promise<JSON> {
    try {
      const _publicBlock = await PublicBlock.get(id)
      logger.info(`Public Block retrieved: ${id}`)

      const _block = _publicBlock.block
      const _blockDetails = _block.sanitize()
      return _blockDetails
    } catch (error) {
      logger.error(`Public Block retrieval failed: ${error.message}`)
      throw error
    }
  }
}

export default PublicBlockController
