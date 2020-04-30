// External Libs
import crypto = require('crypto')
import redis = require('redis')
import { promisify } from 'util'

// External Files
import logService = require('./logger')

// Logger setup
const logger = new logService('Redis')

// Crypto setup
const _crypto = {
  algorithm: 'aes-256-cbc',
  key: process.env.CRYPTO_KEY,
  iv: process.env.CRYPTO_IV,
}

const dataStore = {
  async get(key: string): Promise<any> {
    try {
      const _redisClient = redis.createClient()
      const _get = promisify(_redisClient.get).bind(_redisClient)
      const _storedPayloadString = await _get(key)
      _redisClient.quit()

      if (_storedPayloadString) {
        const _encryptedPayload = Buffer.from(_storedPayloadString, 'hex')

        const _decipher = crypto.createDecipheriv(
          _crypto.algorithm,
          Buffer.from(_crypto.key),
          Buffer.from(_crypto.iv),
        )

        let _decryptedPayload = _decipher.update(_encryptedPayload)
        _decryptedPayload = Buffer.concat([_decryptedPayload, _decipher.final()])
        return _decryptedPayload
      }

      return
    } catch (error) {
      logger.error(`Error when getting key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },

  async set(key: string, payload: string, lifespan: number): Promise<void> {
    try {
      const _cipher = crypto.createCipheriv(
        _crypto.algorithm,
        Buffer.from(_crypto.key),
        _crypto.iv,
      )

      let _encryptedPayload = _cipher.update(payload)
      _encryptedPayload = Buffer.concat([_encryptedPayload, _cipher.final()])
      const _encryptedPayloadString = _encryptedPayload.toString('hex')

      const _redisClient = redis.createClient()
      const _set = promisify(_redisClient.set).bind(_redisClient)
      await _set(key, _encryptedPayloadString, 'EX', lifespan)
      _redisClient.quit()
    } catch (error) {
      logger.error(`Error when setting key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const _redisClient = redis.createClient()
      const _delete = promisify(_redisClient.del).bind(_redisClient)
      await _delete(key)
      _redisClient.quit()
    } catch (error) {
      logger.error(`Error when deleting a key: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },

  async scan(pattern: string, count: number): Promise<string[]> {
    try {
      const _redisClient = redis.createClient()
      const _scan = promisify(_redisClient.scan).bind(_redisClient)
      const [ , _storedKeys ] = await _scan(0, 'MATCH', pattern, 'COUNT', count)
      _redisClient.quit()

      return _storedKeys
    } catch (error) {
      logger.error(`Error when scanning keys: ${error.message}`)
      throw new Error('Pantry is having critical issues')
    }
  },
}

export = dataStore
