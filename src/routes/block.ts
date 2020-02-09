// External Libs
import express = require('express')

// External Files
import BlockController = require('../controllers/block')

const _blockRouter = express.Router()

_blockRouter.post('/create/:account', async (req, res) => {
  try {
    const { body, params } = req
    const { account } = params
    const _response = await BlockController.create(account, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

_blockRouter.get('/get/:account/:name', async (req, res) => {
  try {
    const { params } = req
    const { account, name } = params
    const _response = await BlockController.get(account, name)

    res.send(_response)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = _blockRouter
