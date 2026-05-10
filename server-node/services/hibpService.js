const axios = require('axios')

async function checkBreach(hashPrefix) {
  const upper  = hashPrefix.toUpperCase()
  const res    = await axios.get(`https://api.pwnedpasswords.com/range/${upper}`, {
    headers: { 'Add-Padding': 'true' },
    timeout: 5000
  })

  // Response is "SUFFIX:COUNT\r\n" lines — caller already has full hash to compare
  const lines = res.data.split('\r\n').filter(Boolean)
  const matches = lines.map(line => {
    const [suffix, count] = line.split(':')
    return { suffix: upper + suffix, count: parseInt(count, 10) }
  })

  return { hashPrefix: upper, matches }
}

module.exports = { checkBreach }
