// External Libs
import express = require('express')

// External Files
import AccountController = require('../controllers/account')
import BlockController = require('../controllers/block')

const _apiV1Router = express.Router()

_apiV1Router.post('/create', async (req, res) => {
  try {
    const { body } = req
    const _newAccountUUID = await AccountController.create(body)

    res.send(_newAccountUUID)
  } catch (error) {
    res.status(400).send(`Could not create new pantry: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID', async (req, res) => {
  try {
    const { params } = req
    const { pantryID } = params
    const _account = await AccountController.get(pantryID)

    res.send(_account)
  } catch (error) {
    res.status(400).send(`Could not get pantry: ${error.message}`)
  }
})

_apiV1Router.post('/:pantryID/basket', async (req, res) => {
  try {
    const { body, params } = req
    const { pantryID } = params
    const _response = await BlockController.create(pantryID, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not create basket: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { params } = req
    const { pantryID, basketName } = params
    const _response = await BlockController.get(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not get basket: ${error.message}`)
  }
})

module.exports = _apiV1Router
