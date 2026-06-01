const { body, validationResult } = require('express-validator')

// Reads validation results and returns structured { error, field } on failure
function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const { msg: error, path: field } = errors.array()[0]
    return res.status(400).json({ error, field })
  }
  next()
}

// Strips req.body down to only the listed keys — rejects unexpected extra fields silently
function stripTo(...keys) {
  return (req, _res, next) => {
    req.body = Object.fromEntries(
      keys.filter(k => k in req.body).map(k => [k, req.body[k]])
    )
    next()
  }
}

const scanUrlRules = [
  body('url')
    .isString().withMessage('url must be a string')
    .trim()
    .notEmpty().withMessage('url is required')
    .isLength({ max: 2048 }).withMessage('url must not exceed 2048 characters')
    .matches(/^https?:\/\//).withMessage('url must start with http:// or https://'),
  validate,
  stripTo('url'),
]

const passwordAnalyzeRules = [
  body('password')
    .isString().withMessage('password must be a string')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 1, max: 128 }).withMessage('password must be between 1 and 128 characters'),
  validate,
  stripTo('password'),
]

const passwordBreachRules = [
  body('hash')
    .isString().withMessage('hash must be a string')
    .notEmpty().withMessage('hash is required')
    .matches(/^[A-F0-9]{40}$/).withMessage('hash must be exactly 40 uppercase hex characters'),
  validate,
  stripTo('hash'),
]

module.exports = { scanUrlRules, passwordAnalyzeRules, passwordBreachRules }
