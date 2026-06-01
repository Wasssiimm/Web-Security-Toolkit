const express = require('express')
const pythonBridge = require('../services/pythonBridge')
const hibpService  = require('../services/hibpService')
const { passwordAnalyzeRules, passwordBreachRules } = require('../middleware/validators')

const router = express.Router()

router.post('/analyze', ...passwordAnalyzeRules, async (req, res) => {
  try {
    const result = await pythonBridge.post('/password/analyze', { password: req.body.password })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/breach', ...passwordBreachRules, async (req, res) => {
  try {
    const result = await hibpService.checkBreach(req.body.hash)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
