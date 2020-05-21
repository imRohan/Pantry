// External Libs
import express = require('express')

// External Files
import SystemController = require('../controllers/system')
import logService = require('../services/logger')

// Logger setup
const logger = new logService('API')

// Router setup
const _systemV1Router = express.Router()

_systemV1Router.get('/status', async (req, res) => {
  try {
    logger.info('[GET] Service Status')
    const _status = await SystemController.getStatus()

    res.send(_status)
  } catch (error) {
    res.status(400).send(`Could not create new pantry: ${error.message}`)
  }
})

module.exports = _systemV1Router
