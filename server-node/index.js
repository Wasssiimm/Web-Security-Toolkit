require('dotenv').config()
const { randomUUID } = require('crypto')
const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan    = require('morgan')
const logger    = require('./logger')

const scanRoutes     = require('./routes/scan')
const passwordRoutes = require('./routes/password')

const app     = express()
const PORT    = process.env.PORT    || 3001
const IS_PROD = process.env.NODE_ENV === 'production'

// ── Production startup guard ──────────────────────────────────────────────────
// Refuse to start if critical env vars are missing in production.
// Catches the most common deployment mistake: shipping with insecure defaults.
if (IS_PROD) {
  const required = ['CORS_ORIGIN', 'INTERNAL_API_TOKEN']
  const missing  = required.filter(k => !process.env[k])
  if (missing.length) {
    logger.error(`FATAL: missing required env vars in production: ${missing.join(', ')}`)
    process.exit(1)
  }
}

// ── Request ID ───────────────────────────────────────────────────────────────
// Attach a unique ID to every request so log lines can be correlated.
app.use((req, _res, next) => { req.id = randomUUID(); next() })

// ── HTTP access logging (Morgan → Winston) ───────────────────────────────────
// Logs method, URL, status, response time, and request ID per request.
// Never logs request bodies — passwords and URLs stay out of logs.
morgan.token('req-id', (req) => req.id)
app.use(morgan(':req-id :method :url :status :response-time ms', { stream: logger.stream }))

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
  handler: (req, res, _next, opts) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path })
    res.status(opts.statusCode).json({ error: 'Rate limit exceeded' })
  }
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
  logger.error(err.message || 'Unhandled error', { stack: err.stack, status: err.status })
  const status = err.status || err.statusCode || 500
  if (status === 413) {
    return res.status(413).json({ error: 'Request body too large' })
  }
  if (status >= 400 && status < 500) {
    return res.status(status).json({ error: 'Bad request' })
  }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => logger.info(`Node API running on http://localhost:${PORT}`))
