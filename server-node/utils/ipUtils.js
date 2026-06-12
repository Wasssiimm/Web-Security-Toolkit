const dns = require('dns').promises

const PRIVATE_HOSTNAME_RE = /^(localhost|(.*\.)?local|(.*\.)?internal|(.*\.)?localhost)$/i

class SsrfError extends Error {
  constructor(msg) { super(msg); this.name = 'SsrfError' }
}

function isPrivateIP(ip) {
  if (!ip) return true
  if (ip === '0.0.0.0' || ip === '::' || ip === '::1') return true
  if (/^127\./.test(ip))                               return true
  if (/^10\./.test(ip))                                return true
  if (/^192\.168\./.test(ip))                          return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip))          return true
  if (/^169\.254\./.test(ip))                          return true // link-local / AWS metadata
  if (/^f[cd][0-9a-f]{2}:/i.test(ip))                 return true // fc00::/7
  if (/^fe[89ab][0-9a-f]:/i.test(ip))                 return true // fe80::/10
  return false
}

function isPrivateHostname(hostname) {
  return PRIVATE_HOSTNAME_RE.test(hostname)
}

// Throws SsrfError if the host is private, internal, or resolves to a private IP.
async function assertSafeHost(hostname) {
  if (isPrivateHostname(hostname)) throw new SsrfError('Scanning private/local addresses is not allowed')
  if (isPrivateIP(hostname))       throw new SsrfError('Scanning private/local addresses is not allowed')

  let address
  try {
    ;({ address } = await dns.lookup(hostname))
  } catch {
    throw new SsrfError('Unable to resolve hostname')
  }

  if (isPrivateIP(address)) throw new SsrfError('Scanning private/local addresses is not allowed')
}

module.exports = { isPrivateIP, isPrivateHostname, assertSafeHost, SsrfError }
