// External Libs
import express = require('express')

// External Files
import AccountController from '../controllers/account'
import BlockController from '../controllers/block'
import logService from '../services/logger'

// Logger setup
const logger = new logService('API')

// Router setup
const _apiV1Router = express.Router()

_apiV1Router.post('/create', async (req, res) => {
  try {
    const { body } = req

    logger.info('[POST] Create Account', body)
    const _newAccountUUID = await AccountController.create(body)

    res.send(_newAccountUUID)
  } catch (error) {
    res.status(400).send(`Could not create new pantry: ${error.message}`)
  }
})

_apiV1Router.put('/:pantryID', async (req, res) => {
  try {
    const { body, params } = req
    const { pantryID } = params

    logger.info('[PUT] Update Pantry', params)
    const _response = await AccountController.update(pantryID, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not update pantry: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID', async (req, res) => {
  try {
    const { params } = req
    const { pantryID } = params

    logger.info('[GET] Get Account', params)
    const _account = await AccountController.get(pantryID)

    res.send(_account)
  } catch (error) {
    res.status(400).send(`Could not get pantry: ${error.message}`)
  }
})

_apiV1Router.delete('/:pantryID', async (req, res) => {
  try {
    const { params } = req
    const { pantryID } = params

    logger.info('[DELETE] Delete Account', params)
    const _response = await AccountController.delete(pantryID)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not delete pantry: ${error.message}`)
  }
})

_apiV1Router.post('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { body, params } = req
    const { pantryID, basketName } = params

    logger.info('[POST] Create Basket', params)
    const _response = await BlockController.create(pantryID, basketName, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not create basket: ${error.message}`)
  }
})

_apiV1Router.put('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { body, params } = req
    const { pantryID, basketName } = params

    logger.info('[PUT] Update Basket', params)
    const _response = await BlockController.update(pantryID, basketName, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not update basket: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { params } = req
    const { pantryID, basketName } = params

    logger.info('[GET] Get Basket', params)
    const _response = await BlockController.get(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not get basket: ${error.message}`)
  }
})

_apiV1Router.delete('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { params } = req
    const { pantryID, basketName } = params

    logger.info('[DELETE] Basket', params)
    const _response = await BlockController.delete(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not delete basket: ${error.message}`)
  }
})

export default _apiV1Router
