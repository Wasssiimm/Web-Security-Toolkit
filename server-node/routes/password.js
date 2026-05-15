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
  const { hash } = req.body
  if (!hash || typeof hash !== 'string' || !/^[a-fA-F0-9]{40}$/.test(hash)) {
    return res.status(400).json({ error: 'hash must be a 40-character SHA-1 hex string' })
  }
  try {
    const result = await hibpService.checkBreach(hash)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
