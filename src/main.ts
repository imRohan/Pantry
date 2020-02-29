#!/usr/bin/env node

// TODO
// - Add a Logo
// - Figure out App lingo. Items vs. Jars vs. Baskets
// - Deploy on AWS Litesail
// - Write unit tests
// - Setup Travis or something to run pipelines and run tests
// - Begin workong on v.2?

// Get External Deps
import bodyParser = require('body-parser')
import cors = require('cors')
import express = require('express')
require('dotenv').config()

// Routes
import _routesV1 = require('./routes/apiV1')

// Express server setup and start
const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(express.static(__dirname))

// Routes
server.use('/apiv1/pantry', _routesV1)

server.get('/', (request, response) => {
  response.sendFile('index.html', { root: process.env.PWD })
})

function startApplication() {
  // Start the Express Server & Init the application
  const _serverInstance = server.listen(process.env.API_SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.API_SERVER_PORT}`)
  })

  process.on('SIGINT', () => {
    _serverInstance.close()
  })
}

startApplication()
