import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const scanHeaders = (url) => api.post('/scan/headers', { url })
export const scanPorts   = (url) => api.post('/scan/ports',   { url })
export const scanReport  = (url) => api.post('/scan/report',  { url })

export const analyzePassword = (password)   => api.post('/password/analyze', { password })
export const checkBreach     = (hash)       => api.post('/password/breach',  { hash })
