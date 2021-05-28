// External Files
import * as dataStore from '../services/dataStore'
import logService from '../services/logger'

// Interfaces
import { ISystemStatus } from '../interfaces/system'

// Logger setup
const logger = new logService('System Controller')

class SystemController {
  public static async getStatus(): Promise<ISystemStatus> {
    try {
      const _dataStoreStatus = await dataStore.ping()

      const _status = {
        website: true,
        api: true,
        dataStore: _dataStoreStatus,
      }

      logger.info('System status retrieved')
      return _status
    } catch (error) {
      logger.error(`System status retrieval failed: ${error.message}`)

      const _errorStatus = {
        website: true,
        api: true,
        dataStore: false,
      }
      return _errorStatus
    }
  }
}

export default SystemController
