// External Libs
import express = require('express')
import expressBrute = require('express-brute')
import redisStore = require('express-brute-redis')

// External Files
import AccountController from '../controllers/account'
import BlockController from '../controllers/block'
import logService from '../services/logger'

// Interfaces
import { IAccountRequestParams } from '../interfaces/account'
import { IBlockRequestParams } from '../interfaces/block'

// Logger setup
const logger = new logService('API')

// Express Brute setup (1 request per 1/2 sec)
const store = new redisStore()
const failCallback = (req, res, next, nextValid) => {
  const message = `Please wait till ${nextValid} to make future requests`
  res.status(429).send(`Pantry API limit reached. ${message}`)
}
const bruteForce = new expressBrute(store, {
  failCallback,
  freeRetries: 5,
  minWait: 9000, // 9s
  maxWait: 9000, // 9s
  lifetime: 10, // 10s,
  refreshTimeoutOnRequest: false,
})

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
    const { body } = req
    const { pantryID } = accountParams(req)

    logger.info('[PUT] Update Pantry', { pantryID })
    const _response = await AccountController.update(pantryID, body)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not update pantry: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID', async (req, res) => {
  try {
    const { pantryID } = accountParams(req)

    logger.info('[GET] Get Account', { pantryID })
    const _account = await AccountController.get(pantryID)

    res.send(_account)
  } catch (error) {
    res.status(400).send(`Could not get pantry: ${error.message}`)
  }
})

_apiV1Router.delete('/:pantryID', async (req, res) => {
  try {
    const { pantryID } = accountParams(req)

    logger.info('[DELETE] Delete Account', { pantryID })
    const _response = await AccountController.delete(pantryID)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not delete pantry: ${error.message}`)
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
    res.status(400).send(`Could not create basket: ${error.message}`)
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
    res.status(400).send(`Could not update basket: ${error.message}`)
  }
})

_apiV1Router.get('/:pantryID/basket/:basketName',
  bruteForce.getMiddleware({
    key: (req, res, next) => {
      const { pantryID } = accountParams(req)
      next(pantryID)
    },
  }),
  async (req, res) => {
    try {
      const { pantryID, basketName } = basketParams(req)

      logger.info('[GET] Get Basket', { pantryID, basketName })
      const _response = await BlockController.get(pantryID, basketName)

      res.send(_response)
    } catch (error) {
      res.status(400).send(`Could not get basket: ${error.message}`)
    }
  }
)

_apiV1Router.delete('/:pantryID/basket/:basketName', async (req, res) => {
  try {
    const { pantryID, basketName } = basketParams(req)

    logger.info('[DELETE] Basket', { pantryID, basketName })
    const _response = await BlockController.delete(pantryID, basketName)

    res.send(_response)
  } catch (error) {
    res.status(400).send(`Could not delete basket: ${error.message}`)
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
