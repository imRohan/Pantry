// External Libs
import express = require('express')

// External Files
import PublicBlockController from '../controllers/publicBlock'
import logService from '../services/logger'

// Logger setup
const logger = new logService('API')

// Router setup
const _publicV1Router = express.Router()

_publicV1Router.get('/:publicBasketID', async (req, res) => {
  try {
    const { params } = req
    const { publicBasketID } = params

    logger.info('[GET] Get Public Basket', { publicBasketID })
    const _basket = await PublicBlockController.get(publicBasketID)

    res.send(_basket)
  } catch (error) {
    res.status(400).json({ error: 'Could not get public basket',
                           detials: error.message })
  }
})

export default _publicV1Router
