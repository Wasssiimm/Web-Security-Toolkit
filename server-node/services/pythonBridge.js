const axios = require('axios')

const client = axios.create({
  baseURL: process.env.PYTHON_API_URL || 'http://localhost:8000',
  timeout: 30000,
  // Shared secret so Python rejects requests that didn't come through Node.
  // Prevents bypassing Node's validation by hitting port 8000 directly.
  headers: process.env.INTERNAL_API_TOKEN
    ? { 'X-Internal-Token': process.env.INTERNAL_API_TOKEN }
    : {}
})

async function post(path, data) {
  const res = await client.post(path, data)
  return res.data
}

module.exports = { post }
