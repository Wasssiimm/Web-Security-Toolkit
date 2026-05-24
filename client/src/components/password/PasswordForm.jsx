import { useState } from 'react'
import Spinner from '../shared/Spinner'

export default function PasswordForm({ onSubmit, loading }) {
  const [show, setShow] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const pwd = e.target.password.value
    if (pwd) onSubmit(pwd)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-fuchsia-500 dark:text-fuchsia-400 pointer-events-none">$&gt;</span>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            placeholder="Enter a password to analyse"
            required
            disabled={loading}
            className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-md px-4 py-2.5 pl-10 pr-20 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono-cyber focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-slate-500 hover:text-fuchsia-500 dark:hover:text-fuchsia-300 transition-colors uppercase tracking-wider"
          >
            {show ? '◉ Hide' : '◎ Show'}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 hover:from-fuchsia-400 hover:to-fuchsia-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-md transition-all shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/50"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Analysing…' : 'Analyse →'}
        </button>
      </div>
    </form>
  )
}
