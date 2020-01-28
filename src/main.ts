#!/usr/bin/env node
// Get External Deps
import bodyParser = require('body-parser')
import cors = require('cors')
import express = require('express')
require('dotenv').config()

// Routes
import _sampleRoutes = require('./routes/sample')

// Express server setup and start
const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(express.static(__dirname))

// Routes
server.use('/api/sample', _sampleRoutes)

server.get('/', (request, response) => {
  response.sendFile('index.html', { root: process.env.PWD })
})

// Start the Express Server & Init the application
const _serverInstance = server.listen(process.env.API_SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.API_SERVER_PORT}`)
})

process.on('SIGINT', () => {
  _serverInstance.close()
})
