#!/usr/bin/env node

// Get External Deps
import http = require('http')
import bodyParser = require('body-parser')
import cors = require('cors')
import express = require('express')
import helmet = require('helmet')
require('dotenv').config()

// Setup Express
const app = express()
const server = http.createServer(app)

// Routes
import _routesV1 from './routes/apiV1'
import _systemRoutesV1 from './routes/systemV1'

// External files
import * as environment from './services/environment'
import logService from './services/logger'

// Logger setup
const logger = new logService('API')

// Express server setup and start
app.use(cors())
app.use(bodyParser.json({ limit: '1mb' }))
app.use(express.static(__dirname))
app.use(helmet())

// Routes
app.use('/apiv1/system', _systemRoutesV1)
app.use('/apiv1/pantry', _routesV1)

app.get('/', (request, response) => {
  logger.info('Served Landing Page')
  response.sendFile('index.html', { root: process.env.PWD })
})

function startApplication() {
  // Start the Express Server & Init the application
  const _port = process.env.API_SERVER_PORT
  const _baseMessage = `Pantry is now running on port ${_port}`
  let _bootMessage = _baseMessage

  if (environment.isDevelopment()) {
    _bootMessage = `${_baseMessage} in DEVELOPMENT MODE`
  }
  const _serverInstance = server.listen(process.env.API_SERVER_PORT, () => {
    logger.warn(_bootMessage)
  })

  process.on('SIGINT', () => {
    logger.warn('Pantry shutting down...')
    _serverInstance.close()
  })
}

startApplication()
