// External Libs
import express = require('express')

// External Files
import sample = require('../controllers/sample')

const router = express.Router()

router.get('/hello', async (req, res) => {
  console.log('Got a request /hello')
  try {
    const _response = await sample.sayHi()
    res.send(_response)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
