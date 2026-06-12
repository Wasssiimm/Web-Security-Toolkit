import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      // In dev mode, Vite's React plugin injects an inline HMR preamble script.
      // That script would be blocked by script-src 'self' in the CSP meta tag.
      // Strip the CSP tag in dev so hot-reload keeps working; the CSP is
      // enforced in the production build where no inline scripts exist.
      name: 'strip-csp-in-dev',
      transformIndexHtml(html) {
        if (command === 'serve') {
          return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*\/>/i, '')
        }
        return html
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}))
