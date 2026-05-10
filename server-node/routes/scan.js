const express = require('express')
const { validateUrl } = require('../middleware/validate')
const headerService = require('../services/headerService')
const pythonBridge  = require('../services/pythonBridge')

const router = express.Router()

router.post('/headers', validateUrl, async (req, res) => {
  try {
    const result = await headerService.checkHeaders(req.body.url)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/ports', validateUrl, async (req, res) => {
  try {
    const result = await pythonBridge.post('/scan/ports', { url: req.body.url })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/report', validateUrl, async (req, res) => {
  try {
    const [headers, ports] = await Promise.all([
      headerService.checkHeaders(req.body.url),
      pythonBridge.post('/scan/ports', { url: req.body.url })
    ])
    const vulns  = await pythonBridge.post('/scan/vulnerabilities', { headers, ports })
    const score  = vulns.score ?? 0
    res.json({ url: req.body.url, totalScore: score, maxScore: 10, headers, ports, vulnerabilities: vulns.vulnerabilities, generatedAt: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
