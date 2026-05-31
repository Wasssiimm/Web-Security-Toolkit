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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-cyan-500 dark:text-cyan-400 pointer-events-none">$&gt;</span>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            placeholder="Enter a password to analyse"
            required
            disabled={loading}
            className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-300 dark:border-white/10 rounded-md px-4 py-2.5 pl-10 pr-20 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono-cyber focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors uppercase tracking-wider"
          >
            {show ? '◉ Hide' : '◎ Show'}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-semibold px-6 py-2.5 rounded-md transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/50"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Analysing…' : 'Analyse →'}
        </button>
      </div>
    </form>
  )
}
