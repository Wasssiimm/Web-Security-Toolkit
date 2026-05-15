const axios = require('axios')

// Accepts the full 40-char SHA-1 hash (computed client-side).
// Only the first 5 chars are sent to HIBP — the full hash never leaves this server.
async function checkBreach(fullHash) {
  const upper  = fullHash.toUpperCase()
  const prefix = upper.slice(0, 5)
  const suffix = upper.slice(5)

  const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
    timeout: 5000
  })

  // Response is "SUFFIX:COUNT\r\n" lines
  const lines = res.data.split('\r\n').filter(Boolean)
  const match = lines.find(line => line.split(':')[0] === suffix)

  if (!match) {
    return { breached: false, occurrences: 0, message: 'This password has not been found in any known data breaches.' }
  }

  const occurrences = parseInt(match.split(':')[1], 10)
  return {
    breached:    true,
    occurrences,
    message:     `This password has been found in ${occurrences.toLocaleString()} known data breach(es). Do not use it.`
  }
}

module.exports = { checkBreach }
