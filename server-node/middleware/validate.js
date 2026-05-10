const PRIVATE_IP = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i

function validateUrl(req, res, next) {
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' })
  }
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Only http and https URLs are allowed' })
    }
    if (PRIVATE_IP.test(parsed.hostname)) {
      return res.status(400).json({ error: 'Scanning private/local addresses is not allowed' })
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }
  next()
}

module.exports = { validateUrl }
