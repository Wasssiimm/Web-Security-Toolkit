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
          <input
            type={show ? 'text' : 'password'}
            name="password"
            placeholder="Enter a password to analyse"
            required
            disabled={loading}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 pr-16 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading && <Spinner size="sm" />}
          {loading ? 'Analysing…' : 'Analyse'}
        </button>
      </div>
    </form>
  )
}
