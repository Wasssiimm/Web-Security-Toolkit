const axios = require('axios')

const client = axios.create({
  baseURL: process.env.PYTHON_API_URL || 'http://localhost:8000',
  timeout: 30000
})

async function post(path, data) {
  const res = await client.post(path, data)
  return res.data
}

module.exports = { post }
