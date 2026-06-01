// Caps the number of simultaneous nmap scans.
// Each scan can run for up to 30s — without this, a handful of users could
// lock up the server with concurrent scans even within the rate limit window.
let activeScans = 0
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_SCANS) || 3

function scanConcurrencyLimit(req, res, next) {
  if (activeScans >= MAX_CONCURRENT) {
    return res.status(503).json({
      error: 'Server busy — too many scans in progress. Try again in a moment.'
    })
  }

  activeScans++
  let released = false
  const release = () => { if (!released) { released = true; activeScans-- } }

  res.on('finish', release)
  res.on('close',  release) // client disconnected early

  next()
}

module.exports = { scanConcurrencyLimit }
