// External Libs
import redis = require('redis')
import { promisify } from 'util'

// External Files
import logService = require('./logger')

// Logger setup
const logger = new logService('Redis')

const dataStore = {
  async get(uuid: string): Promise<any> {
    try {
      const _redisClient = redis.createClient()
      const _get = promisify(_redisClient.get).bind(_redisClient)
      const _payload = await _get(uuid)
      _redisClient.quit()

      return _payload
    } catch (error) {
      logger.error(`Error when getting key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },

  async set(uuid: string, payload: string, lifespan: number): Promise<void> {
    try {
      const _redisClient = redis.createClient()
      const _set = promisify(_redisClient.set).bind(_redisClient)
      await _set(uuid, payload, 'EX', lifespan)
      _redisClient.quit()
    } catch (error) {
      logger.error(`Error when setting key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },

  async delete(uuid: string): Promise<void> {
    try {
      const _redisClient = redis.createClient()
      const _delete = promisify(_redisClient.del).bind(_redisClient)
      await _delete(uuid)
      _redisClient.quit()
    } catch (error) {
      logger.error(`Error when deleting a key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },
}

export = dataStore
