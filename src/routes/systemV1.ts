import express = require('express')

import logService from '../services/logger'
import ClientValidator from '../services/clientValidator'
import SystemController from '../controllers/system'

const logger = new logService('API')

const _systemV1Router = express.Router()
_systemV1Router.get('/status', async (req, res) => {
  try {
    logger.info('[GET] Service Status')
    if (ClientValidator.validate(req)) {
      const _stats = await SystemController.getStatus()
      res.send(_stats)
    } else {
      logger.warn('Unauthorized client')
      res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Could not get system status',
                           details: error.message })
  }
})

export default _systemV1Router
