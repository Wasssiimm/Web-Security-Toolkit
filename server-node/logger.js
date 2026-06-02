const { createLogger, format, transports } = require('winston')

const IS_PROD = process.env.NODE_ENV === 'production'

// Human-readable format for the dev console
const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    const extras = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
    return `${timestamp} ${level}: ${message}${extras}`
  })
)

// Structured JSON for production — machine-readable by Betterstack Logtail
const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
)

const logger = createLogger({
  // 'http' level captures Morgan access logs; includes info/warn/error above it
  level: 'http',
  format: IS_PROD ? prodFormat : devFormat,
  transports: [new transports.Console()]
})

// Betterstack Logtail transport — active whenever the token is set (dev or prod)
if (process.env.LOGTAIL_SOURCE_TOKEN) {
  const { Logtail }          = require('@logtail/node')
  const { LogtailTransport } = require('@logtail/winston')
  const logtailOptions = process.env.LOGTAIL_INGESTING_HOST
    ? { endpoint: `https://${process.env.LOGTAIL_INGESTING_HOST}` }
    : {}
  logger.add(new LogtailTransport(new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, logtailOptions)))
}

// Morgan stream — pipes HTTP access log lines into Winston at 'http' level
logger.stream = { write: (msg) => logger.http(msg.trim()) }

module.exports = logger
