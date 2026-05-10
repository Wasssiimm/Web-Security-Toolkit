require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const scanRoutes     = require('./routes/scan')
const passwordRoutes = require('./routes/password')

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/scan',     scanRoutes)
app.use('/api/password', passwordRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Node API running on http://localhost:${PORT}`))
