// External Libs
import redis = require('redis')
import { promisify } from 'util'

const dataStore = {
  async get(uuid: string): Promise<any> {
    try {
      const _redisClient = redis.createClient()
      const _get = promisify(_redisClient.get).bind(_redisClient)
      const _payload = await _get(uuid)
      _redisClient.quit()

      return _payload
    } catch (error) {
      console.log(`Redis error: ${error.message}`)
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
      console.log(`Redis error: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },
}

export = dataStore
