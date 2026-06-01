const express = require('express')
const { validateUrl }          = require('../middleware/validate')
const { scanUrlRules }         = require('../middleware/validators')
const { scanConcurrencyLimit } = require('../middleware/concurrencyLimit')
const headerService = require('../services/headerService')
const pythonBridge  = require('../services/pythonBridge')

const router = express.Router()

// True when the Python engine is unreachable (connection refused / reset / timed out).
// Used to return a user-friendly 503 instead of leaking "ECONNREFUSED 127.0.0.1:8000".
function isBridgeDown(err) {
  return err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'
}

function rawHeaderValues(headersResult) {
  return Object.fromEntries(
    Object.entries(headersResult.headers)
      .filter(([, data]) => data.value)
      .map(([key, data]) => [key, data.value])
  )
}

function mergeQuality(headersResult, qualityResult) {
  for (const [key, q] of Object.entries(qualityResult.headers)) {
    if (headersResult.headers[key]) {
      headersResult.headers[key].quality = q.quality
      headersResult.headers[key].issues  = q.issues
    }
  }
}

// POST /api/scan/headers
router.post('/headers', ...scanUrlRules, validateUrl, async (req, res) => {
  try {
    const result = await headerService.checkHeaders(req.body.url)
    try {
      const quality = await pythonBridge.post('/scan/headers', { headers: rawHeaderValues(result) })
      mergeQuality(result, quality)
    } catch {
      // Python unavailable — return basic presence check without quality data
    }
    res.json(result)
  } catch (err) {
    // headerService throws user-facing messages ("Could not reach …")
    res.status(503).json({ error: err.message })
  }
})

// POST /api/scan/ports
router.post('/ports', ...scanUrlRules, validateUrl, scanConcurrencyLimit, async (req, res, next) => {
  try {
    const result = await pythonBridge.post('/scan/ports', { url: req.body.url })
    res.json(result)
  } catch (err) {
    if (isBridgeDown(err)) {
      return res.status(503).json({ error: 'Security engine unavailable — try again later.' })
    }
    next(err) // Unexpected — global handler returns generic 500, no internal details
  }
})

// POST /api/scan/report
router.post('/report', ...scanUrlRules, validateUrl, scanConcurrencyLimit, async (req, res, next) => {
  try {
    const [headers, ports] = await Promise.all([
      headerService.checkHeaders(req.body.url),
      pythonBridge.post('/scan/ports', { url: req.body.url })
    ])

    const quality = await pythonBridge.post('/scan/headers', { headers: rawHeaderValues(headers) })
    mergeQuality(headers, quality)

    const vulns = await pythonBridge.post('/scan/vulnerabilities', { headers, ports })

    res.json({
      url:             req.body.url,
      totalScore:      vulns.score,
      maxScore:        10,
      grade:           vulns.grade,
      vulnerabilities: vulns.vulnerabilities,
      headers:         headers.headers,
      headerScore:     headers.headerScore,
      maxHeaderScore:  headers.maxHeaderScore,
      host:            ports.host,
      ports:           ports.ports,
      generatedAt:     new Date().toISOString()
    })
  } catch (err) {
    if (isBridgeDown(err)) {
      return res.status(503).json({ error: 'Security engine unavailable — try again later.' })
    }
    // headerService throws user-facing messages
    if (err.message?.startsWith('Could not reach')) {
      return res.status(503).json({ error: err.message })
    }
    next(err) // Unexpected — global handler returns generic 500
  }
})

module.exports = router
