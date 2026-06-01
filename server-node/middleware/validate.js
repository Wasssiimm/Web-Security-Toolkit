const dns = require('dns').promises

// Blocks hostnames that are obviously private/internal by name
const PRIVATE_HOSTNAME = /^(localhost|(.*\.)?local|(.*\.)?internal|(.*\.)?localhost)$/i

function isPrivateIP(ip) {
  if (!ip) return true
  // IPv4 catch-all and loopback
  if (ip === '0.0.0.0') return true
  if (/^127\./.test(ip)) return true
  // RFC-1918 private ranges
  if (/^10\./.test(ip)) return true
  if (/^192\.168\./.test(ip)) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true
  // Link-local (169.254.x.x) — also covers AWS/GCP metadata endpoint 169.254.169.254
  if (/^169\.254\./.test(ip)) return true
  // IPv6 loopback and unspecified
  if (ip === '::1' || ip === '::') return true
  // IPv6 unique-local (fc00::/7) — fc** and fd** prefixes
  if (/^f[cd][0-9a-f]{2}:/i.test(ip)) return true
  // IPv6 link-local (fe80::/10)
  if (/^fe[89ab][0-9a-f]:/i.test(ip)) return true
  return false
}

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

  const hostname = parsed.hostname

  // Block .local / .internal / .localhost TLD hostnames before DNS resolution
  if (PRIVATE_HOSTNAME.test(hostname)) {
    return res.status(400).json({ error: 'Scanning private/local addresses is not allowed' })
  }

  // Block bare private IPs supplied directly in the URL
  if (isPrivateIP(hostname)) {
    return res.status(400).json({ error: 'Scanning private/local addresses is not allowed' })
  }

  // DNS rebinding defence: resolve the hostname to its actual IP and check that
  // too. An attacker could use a public-looking domain that resolves to 127.0.0.1.
  try {
    const { address } = await dns.lookup(hostname)
    if (isPrivateIP(address)) {
      return res.status(400).json({ error: 'Scanning private/local addresses is not allowed' })
    }
  } catch {
    return res.status(400).json({ error: 'Unable to resolve hostname' })
  }

  next()
}

module.exports = { validateUrl }
