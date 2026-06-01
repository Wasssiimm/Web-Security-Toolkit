import { useState } from 'react'
import Spinner from '../shared/Spinner'

function validateUrl(url) {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Only http:// and https:// URLs are allowed'
    }
    return null
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)'
  }
}

export default function ScannerForm({ onSubmit, loading }) {
  const [permitted, setPermitted] = useState(false)
  const [urlError,  setUrlError]  = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const url = e.target.url.value.trim()
    const error = validateUrl(url)
    if (error) {
      setUrlError(error)
      return
    }
    setUrlError(null)
    if (permitted) onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-lime-500 dark:text-lime-500 pointer-events-none">$&gt;</span>
          <input
            type="url"
            name="url"
            placeholder="https://target.example"
            required
            disabled={loading}
            onChange={() => urlError && setUrlError(null)}
            className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded px-4 py-2.5 pl-10 text-gray-900 dark:text-[#f2f2f2] placeholder-gray-400 dark:placeholder-[#444] font-mono-cyber text-sm focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !permitted}
          className="flex items-center gap-2 bg-lime-400 hover:bg-lime-300 disabled:bg-gray-200 dark:disabled:bg-[#1a1a1a] disabled:cursor-not-allowed text-[#090909] disabled:text-gray-400 dark:disabled:text-[#444] font-semibold px-6 py-2.5 rounded transition-all text-sm"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {urlError && (
        <p className="text-xs text-red-500 dark:text-red-400 font-mono-cyber pl-1">{urlError}</p>
      )}

      <label className="flex items-center gap-3 cursor-pointer w-fit group">
        <input
          type="checkbox"
          checked={permitted}
          onChange={e => setPermitted(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 accent-lime-500 cursor-pointer"
        />
        <span className="text-sm text-gray-600 dark:text-[#888] group-hover:text-gray-900 dark:group-hover:text-[#f2f2f2] transition-colors">
          I confirm I have permission to scan this target
        </span>
      </label>
    </form>
  )
}
