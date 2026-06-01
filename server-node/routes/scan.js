const express = require('express')
const { validateUrl } = require('../middleware/validate')
const { scanUrlRules } = require('../middleware/validators')
const headerService = require('../services/headerService')
const pythonBridge  = require('../services/pythonBridge')

const router = express.Router()

// Extracts { 'header-key': 'value', ... } from the headerService result
// so it can be sent to Python's /scan/headers for quality analysis
function rawHeaderValues(headersResult) {
  return Object.fromEntries(
    Object.entries(headersResult.headers)
      .filter(([, data]) => data.value)
      .map(([key, data]) => [key, data.value])
  )
}

// Merges Python's quality analysis back into the Node headers result in-place
function mergeQuality(headersResult, qualityResult) {
  for (const [key, q] of Object.entries(qualityResult.headers)) {
    if (headersResult.headers[key]) {
      headersResult.headers[key].quality = q.quality
      headersResult.headers[key].issues  = q.issues
    }
  }
}

// POST /api/scan/headers
// Returns presence + quality analysis for the 8 security headers
router.post('/headers', ...scanUrlRules, validateUrl, async (req, res) => {
  try {
    const result = await headerService.checkHeaders(req.body.url)

    // Enrich with Python quality analysis — best-effort, don't fail if Python is down
    try {
      const quality = await pythonBridge.post('/scan/headers', { headers: rawHeaderValues(result) })
      mergeQuality(result, quality)
    } catch {
      // Python unavailable — return basic presence check without quality data
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/scan/ports
// Delegates to Python's nmap wrapper
router.post('/ports', ...scanUrlRules, validateUrl, async (req, res) => {
  try {
    const result = await pythonBridge.post('/scan/ports', { url: req.body.url })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/scan/report
// Full scan: headers + quality + ports + vulnerability detection + score/grade
router.post('/report', ...scanUrlRules, validateUrl, async (req, res) => {
  try {
    // Step 1 — run header fetch (Node) and port scan (Python) in parallel
    const [headers, ports] = await Promise.all([
      headerService.checkHeaders(req.body.url),
      pythonBridge.post('/scan/ports', { url: req.body.url })
    ])

    // Step 2 — enrich headers with Python quality analysis
    const quality = await pythonBridge.post('/scan/headers', { headers: rawHeaderValues(headers) })
    mergeQuality(headers, quality)

    // Step 3 — vulnerability detection using enriched headers + port results
    const vulns = await pythonBridge.post('/scan/vulnerabilities', { headers, ports })

    // Step 4 — assemble the final report
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
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
