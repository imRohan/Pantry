#!/usr/bin/env node

// TODO
// - Write unit tests
// - Begin workong on v.2?
// - Setup Travis or something to run pipelines and run tests

// Get External Deps
import bodyParser = require('body-parser')
import cors = require('cors')
import express = require('express')
import helmet = require('helmet')
require('dotenv').config()

// Routes
import _routesV1 = require('./routes/apiV1')
import _systemRoutesV1 = require('./routes/systemV1')

// External files
import logService = require('./services/logger')

// Logger setup
const logger = new logService('API')

// Express server setup and start
const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(express.static(__dirname))
server.use(helmet())

// Routes
server.use('/apiv1/system', _systemRoutesV1)
server.use('/apiv1/pantry', _routesV1)

server.get('/', (request, response) => {
  logger.info('Served Landing Page')
  response.sendFile('index.html', { root: process.env.PWD })
})

function startApplication() {
  // Start the Express Server & Init the application
  const _serverInstance = server.listen(process.env.API_SERVER_PORT, () => {
    logger.warn(`Pantry is now running on port ${process.env.API_SERVER_PORT}`)
  })

  process.on('SIGINT', () => {
    logger.warn('Pantry shutting down...')
    _serverInstance.close()
  })
}

startApplication()
