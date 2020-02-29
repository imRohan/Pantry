// External Libs
import redis = require('redis')
import { promisify } from 'util'

class DataStore {
  private client

  constructor() {
    this.client = redis.createClient()
  }

  public async get(uuid: string): Promise<any> {
    try {
      const _get = promisify(this.client.get).bind(this.client)
      const _payload = await _get(uuid)
      this.client.quit()

      return _payload
    } catch (error) {
      console.log(`Redis error: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  }

  public async set(uuid: string, payload: string, lifespan: number): Promise<void> {
    try {
      const _set = promisify(this.client.set).bind(this.client)
      await _set(uuid, payload, 'EX', lifespan)
      this.client.quit()
    } catch (error) {
      console.log(`Redis error: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  }
}

export = DataStore
