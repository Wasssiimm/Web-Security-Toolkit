const axios = require('axios')

const HEADERS = [
  { key: 'content-security-policy',   risk: 'high',   desc: 'Prevents XSS attacks' },
  { key: 'strict-transport-security', risk: 'high',   desc: 'Enforces HTTPS (HSTS)' },
  { key: 'x-content-type-options',    risk: 'medium', desc: 'Prevents MIME-sniffing' },
  { key: 'x-frame-options',           risk: 'medium', desc: 'Protects against clickjacking' },
  { key: 'referrer-policy',           risk: 'low',    desc: 'Limits referrer information' },
  { key: 'permissions-policy',        risk: 'low',    desc: 'Controls browser API access' },
  { key: 'x-xss-protection',          risk: 'low',    desc: 'Legacy XSS filter' },
  { key: 'cache-control',             risk: 'low',    desc: 'Prevents unsafe caching' }
]

async function checkHeaders(url) {
  const response = await axios.get(url, { timeout: 5000, validateStatus: () => true })
  const raw = response.headers

  const headers = {}
  let score = 0
  for (const h of HEADERS) {
    const value = raw[h.key] || null
    headers[h.key] = { present: !!value, value, risk: value ? 'low' : h.risk, desc: h.desc }
    if (value) score++
  }

  return { url, headers, headerScore: score, maxHeaderScore: HEADERS.length }
}

module.exports = { checkHeaders }
