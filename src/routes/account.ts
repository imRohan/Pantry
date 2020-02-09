// External Libs
import express = require('express')

// External Files
import AccountController = require('../controllers/account')

const _accountRouter = express.Router()

_accountRouter.post('/create', async (req, res) => {
  try {
    const { body } = req
    const _newAccountUUID = await AccountController.create(body)

    res.send(_newAccountUUID)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

_accountRouter.get('/get/:uuid', async (req, res) => {
  try {
    const { params } = req
    const { uuid } = params
    const _account = await AccountController.get(uuid)

    res.send(_account)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = _accountRouter
