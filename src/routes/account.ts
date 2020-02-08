// External Libs
import express = require('express')

// External Files
import AccountController = require('../controllers/account')

const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    console.log('Account - Got request /create')

    const { body } = req
    const _newAccount = await AccountController.create(body)

    res.send(_newAccount)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/get/:uuid', async (req, res) => {
  try {
    console.log('Account - Got request /get')

    const _account = await AccountController.get(req.params.uuid)

    res.send(_account)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
