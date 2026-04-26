// External Libs
import express = require('express')

// External Files
import AccountController from '../controllers/account'
import BlockController from '../controllers/block'
import PublicBlockController from '../controllers/publicBlock'
import logService from '../services/logger'

// Interfaces
import { IAccountRequestParams } from '../interfaces/account'
import { IBlockRequestParams } from '../interfaces/block'

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
    res.status(400).json({ error: 'Could not create new pantry',
                           details: error.message })
  }
})

_apiV1Router.put('/:pantryID', async (req, res) => {
  try {
    const { body } = req
    const { pantryID } = accountParams(req)

    logger.info('[PUT] Update Pantry', { pantryID })
    const _response = await AccountController.update(pantryID, body)

    res.send(_response)
  } catch (error) {
    res.status(400).json({ error: 'Could not update pantry',
                           details: error.message })
  }
})

_apiV1Router.get('/:pantryID', async (req, res) => {
  try {
    const { pantryID } = accountParams(req)

    logger.info('[GET] Get Account', { pantryID })
    const _account = await AccountController.get(pantryID)

    res.send(_account)
  } catch (error) {
    res.status(400).json({ error: 'Could not get pantry',
                           details: error.message })
  }
})

_apiV1Router.delete('/:pantryID', async (req, res) => {
  try {
    const { pantryID } = accountParams(req)

    logger.info('[DELETE] Delete Account', { pantryID })
    await AccountController.delete(pantryID)

    res.status(204)
  } catch (error) {
    res.status(400).json({ error: 'Could not delete pantry',
                           details: error.message })
  }
})

_apiV1Router.post('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { body } = req
    const { pantryID, basketName } = basketParams(req)

    logger.info('[POST] Create Basket', { pantryID, basketName })
    const _response = await BlockController.create(pantryID, basketName, body)

    res.send(_response)
  } catch (error) {
    res.status(400).json({ error: 'Could not create basket',
                           details: error.message })
  }
})

_apiV1Router.put('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { body } = req
    const { pantryID, basketName } = basketParams(req)

    logger.info('[PUT] Update Basket', { pantryID, basketName })
    const _response = await BlockController.update(pantryID, basketName, body)

    res.send(_response)
  } catch (error) {
    res.status(400).json({ error: 'Could not update basket',
                           details: error.message })
  }
})

_apiV1Router.get('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { pantryID, basketName } = basketParams(req)

    logger.info('[GET] Get Basket', { pantryID, basketName })
    const _response = await BlockController.get(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).json({ error: 'Could not get basket',
                           details: error.message })
  }
})

_apiV1Router.delete('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { pantryID, basketName } = basketParams(req)

    logger.info('[DELETE] Basket', { pantryID, basketName })
    const _response = await BlockController.delete(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).json({ error: 'Could not delete basket',
                           details: error.message })
  }
})

_apiV1Router.get('/:pantryID/basket/:basketName/public', async (req, res) => {
  try {
    const { pantryID, basketName } = basketParams(req)

    logger.info(`[GET] Create Public Basket for ${pantryID}, ${basketName}`)
    const _newPublicBasketUUID = await PublicBlockController.create(pantryID, basketName)

    res.send(_newPublicBasketUUID)
  } catch (error) {
    res.status(400).json({ error: 'Could create public basket',
                           details: error.message })
  }
})

function basketParams(req): IBlockRequestParams {
  const { params } = req
  const { pantryID, basketName } = params
  return { pantryID, basketName }
}

function accountParams(req): IAccountRequestParams {
  const { params } = req
  const { pantryID } = params
  return { pantryID }
}

export default _apiV1Router
