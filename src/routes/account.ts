// External Libs
import express = require('express')

// External Files
import AccountController = require('../controllers/account')

const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    const { body } = req
    const _newAccountUUID = await AccountController.create(body)

    res.send(_newAccountUUID)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/get/:uuid', async (req, res) => {
  try {
    const _account = await AccountController.get(req.params.uuid)

    res.send(_account)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
