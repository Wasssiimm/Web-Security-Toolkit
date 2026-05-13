const axios = require('axios')

const HEADERS = [
  {
    key:            'content-security-policy',
    risk:           'high',
    desc:           'Prevents XSS attacks by restricting where scripts can load from',
    recommendation: "Add a Content-Security-Policy header, e.g. default-src 'self'"
  },
  {
    key:            'strict-transport-security',
    risk:           'high',
    desc:           'Forces browsers to use HTTPS (protects against downgrade attacks)',
    recommendation: 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains'
  },
  {
    key:            'x-content-type-options',
    risk:           'medium',
    desc:           'Stops browsers from guessing the content type (MIME-sniffing)',
    recommendation: 'Add X-Content-Type-Options: nosniff'
  },
  {
    key:            'x-frame-options',
    risk:           'medium',
    desc:           'Prevents the page from being embedded in an iframe (clickjacking)',
    recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN'
  },
  {
    key:            'referrer-policy',
    risk:           'low',
    desc:           'Controls how much referrer information is sent with requests',
    recommendation: 'Add Referrer-Policy: no-referrer or strict-origin-when-cross-origin'
  },
  {
    key:            'permissions-policy',
    risk:           'low',
    desc:           'Restricts which browser features (camera, mic, etc.) the page can use',
    recommendation: 'Add Permissions-Policy to disable unused browser features'
  },
  {
    key:            'x-xss-protection',
    risk:           'low',
    desc:           'Legacy XSS filter for older browsers (modern browsers use CSP instead)',
    recommendation: 'Add X-XSS-Protection: 1; mode=block'
  },
  {
    key:            'cache-control',
    risk:           'low',
    desc:           'Prevents browsers from caching sensitive pages',
    recommendation: 'Add Cache-Control: no-store for pages with sensitive data'
  }
]

async function checkHeaders(url) {
  let response
  try {
    response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true,   // don't throw on 4xx/5xx — we still want the headers
      headers: { 'User-Agent': 'WebSecurityToolkit/1.0' }
    })
  } catch (err) {
    // Network-level failure: DNS error, timeout, connection refused, etc.
    const reason = err.code === 'ECONNABORTED' ? 'Request timed out after 5s'
                 : err.code === 'ENOTFOUND'    ? 'Domain could not be resolved (DNS failure)'
                 : err.message
    throw new Error(`Could not reach ${url}: ${reason}`)
  }

  const raw = response.headers
  const headers = {}
  let score = 0

  for (const h of HEADERS) {
    const value = raw[h.key] || null
    const present = !!value
    headers[h.key] = {
      present,
      value,
      risk:           present ? 'none' : h.risk,
      desc:           h.desc,
      recommendation: present ? null : h.recommendation
    }
    if (present) score++
  }

  return { url, headers, headerScore: score, maxHeaderScore: HEADERS.length }
}

module.exports = { checkHeaders }
