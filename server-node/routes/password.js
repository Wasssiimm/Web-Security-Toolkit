const express = require('express')
const pythonBridge = require('../services/pythonBridge')
const hibpService  = require('../services/hibpService')

const router = express.Router()

router.post('/analyze', async (req, res) => {
  const { password } = req.body
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'password is required' })
  }
  try {
    const result = await pythonBridge.post('/password/analyze', { password })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/breach', async (req, res) => {
  const { hashPrefix } = req.body
  if (!hashPrefix || typeof hashPrefix !== 'string' || hashPrefix.length !== 5) {
    return res.status(400).json({ error: 'hashPrefix must be exactly 5 hex characters' })
  }
  try {
    const result = await hibpService.checkBreach(hashPrefix)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
