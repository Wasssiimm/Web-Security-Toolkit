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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-lime-500 dark:text-lime-500 pointer-events-none">$&gt;</span>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            maxLength={128}
            placeholder="Enter a password to analyse"
            required
            disabled={loading}
            className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded px-4 py-2.5 pl-10 pr-20 text-gray-900 dark:text-[#f2f2f2] placeholder-gray-400 dark:placeholder-[#444] font-mono-cyber text-sm focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono-cyber text-gray-500 dark:text-[#555] hover:text-lime-700 dark:hover:text-lime-400 transition-colors uppercase tracking-wider"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-lime-400 hover:bg-lime-300 disabled:bg-gray-200 dark:disabled:bg-[#1a1a1a] disabled:cursor-not-allowed text-[#090909] disabled:text-gray-400 dark:disabled:text-[#444] font-semibold px-6 py-2.5 rounded transition-all text-sm"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Analysing...' : 'Analyse'}
        </button>
      </div>
    </form>
  )
}
