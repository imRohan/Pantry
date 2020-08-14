// External Libs
import express = require('express')

// External Files
import SystemController from '../controllers/system'
import logService from '../services/logger'

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

export default _systemV1Router
