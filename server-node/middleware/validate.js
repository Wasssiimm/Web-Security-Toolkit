const { assertSafeHost, SsrfError } = require('../utils/ipUtils')

async function validateUrl(req, res, next) {
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' })
  }

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only http and https URLs are allowed' })
  }

  try {
    await assertSafeHost(parsed.hostname)
  } catch (err) {
    if (err instanceof SsrfError) {
      return res.status(400).json({ error: err.message })
    }
    return res.status(400).json({ error: 'Invalid URL' })
  }

  next()
}

module.exports = { validateUrl }
