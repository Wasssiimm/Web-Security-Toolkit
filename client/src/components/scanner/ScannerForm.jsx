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
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-cyan-500 dark:text-cyan-400 pointer-events-none">$&gt;</span>
          <input
            type="url"
            name="url"
            placeholder="https://target.example"
            required
            disabled={loading}
            className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-md px-4 py-2.5 pl-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono-cyber focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !permitted}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-semibold px-6 py-2.5 rounded-md transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/50 disabled:shadow-none"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Scanning…' : 'Scan →'}
        </button>
      </div>

      <label className="flex items-center gap-3 cursor-pointer w-fit group">
        <input
          type="checkbox"
          checked={permitted}
          onChange={e => setPermitted(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 accent-cyan-500 cursor-pointer"
        />
        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          I confirm I have permission to scan this target
        </span>
      </label>
    </form>
  )
}
