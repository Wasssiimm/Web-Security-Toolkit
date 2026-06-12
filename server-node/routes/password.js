const express = require('express')
const pythonBridge = require('../services/pythonBridge')
const hibpService  = require('../services/hibpService')
const { passwordAnalyzeRules, passwordBreachRules } = require('../middleware/validators')

const router = express.Router()

function isBridgeDown(err) {
  return err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'
}

router.post('/analyze', ...passwordAnalyzeRules, async (req, res, next) => {
  try {
    const result = await pythonBridge.post('/password/analyze', { password: req.body.password })
    res.json(result)
  } catch (err) {
    if (isBridgeDown(err)) {
      return res.status(503).json({ error: 'Security engine unavailable — try again later.' })
    }
    next(err)
  }
})

router.post('/breach', ...passwordBreachRules, async (req, res, next) => {
  try {
    const result = await hibpService.checkBreach(req.body.hash)
    res.json(result)
  } catch (err) {
    next(err) // HIBP errors — global handler returns generic 500, no internal details
  }
})

module.exports = router
