#!/usr/bin/env node

// TODO
// - Build the front end (v.1)
// - Clean up error logging, and output to users (maybe use friendly, verbose?)
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
import _accountRoutes = require('./routes/account')
import _blockRoutes = require('./routes/block')

// Express server setup and start
const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(express.static(__dirname))

// Routes
server.use('/api/', _accountRoutes)
server.use('/api/basket', _blockRoutes)

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
