require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const rateLimit = require('express-rate-limit')

const scanRoutes     = require('./routes/scan')
const passwordRoutes = require('./routes/password')

const app     = express()
const PORT    = process.env.PORT    || 3001
const IS_PROD = process.env.NODE_ENV === 'production'

// ── Security headers ─────────────────────────────────────────────────────────
// Must be the very first middleware so every response carries these headers.
app.use(helmet({
  contentSecurityPolicy: {
    // This is a pure API — no HTML is served, so lock down everything.
    directives: { defaultSrc: ["'none'"] }
  },
  strictTransportSecurity: IS_PROD
    ? { maxAge: 31536000, includeSubDomains: true }
    : false,
  referrerPolicy: { policy: 'no-referrer' }
}))

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow only the known frontend origin(s). In production set CORS_ORIGIN to the
// live domain. Multiple origins can be comma-separated: "https://a.com,https://b.com"
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173']

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}))

// ── Body limits ───────────────────────────────────────────────────────────────
// Reject oversized payloads before they reach any route logic.
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb', extended: false }))

// ── Trust proxy ───────────────────────────────────────────────────────────────
// Required so req.ip resolves correctly when behind Nginx in production.
// Value 1 = trust exactly one hop (the Nginx reverse-proxy).
app.set('trust proxy', 1)

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Thresholds are configurable via .env so they can be tuned without a code change.
const limiterDefaults = {
  standardHeaders: true,  // Sends RateLimit-* and Retry-After headers (RFC standard)
  legacyHeaders:   false, // Disables the old X-RateLimit-* headers
  message:         { error: 'Rate limit exceeded' }
}

// Global ceiling — all routes combined per IP
const globalLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit:    parseInt(process.env.RATE_LIMIT_GLOBAL)   || 200
})

// Scan routes are resource-heavy (nmap, external HTTP) — keep tight
const scanLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit:    parseInt(process.env.RATE_LIMIT_SCAN)     || 10
})

// Password routes are lightweight but still cap them
const passwordLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit:    parseInt(process.env.RATE_LIMIT_PASSWORD) || 40
})

app.use(globalLimiter)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/scan',     scanLimiter,     scanRoutes)
app.use('/api/password', passwordLimiter, passwordRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Global error handler ──────────────────────────────────────────────────────
// Logs the real error server-side; returns safe, generic messages to clients.
// 4xx errors from middleware (body-parser 413, JSON syntax 400) keep their
// status codes but get sanitised messages. Everything else → generic 500.
app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err.status || err.statusCode || 500
  if (status === 413) {
    return res.status(413).json({ error: 'Request body too large' })
  }
  if (status >= 400 && status < 500) {
    return res.status(status).json({ error: 'Bad request' })
  }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => console.log(`Node API running on http://localhost:${PORT}`))
