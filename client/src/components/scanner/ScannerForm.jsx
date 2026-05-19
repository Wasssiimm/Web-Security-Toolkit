import { useState } from 'react'
import Spinner from '../shared/Spinner'

export default function ScannerForm({ onSubmit, loading }) {
  const [permitted, setPermitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const url = e.target.url.value.trim()
    if (url && permitted) onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <input
          type="url"
          name="url"
          placeholder="https://example.com"
          required
          disabled={loading}
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !permitted}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Scanning…' : 'Scan'}
        </button>
      </div>

      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={permitted}
          onChange={e => setPermitted(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 accent-cyan-500 cursor-pointer"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          I confirm I have permission to scan this target
        </span>
      </label>
    </form>
  )
}
