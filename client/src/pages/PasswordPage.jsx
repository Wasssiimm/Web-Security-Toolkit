import { useState } from 'react'
import PasswordForm from '../components/password/PasswordForm'
import StrengthBar from '../components/password/StrengthBar'
import EntropyGauge from '../components/password/EntropyGauge'
import PatternWarnings from '../components/password/PatternWarnings'
import BreachResult from '../components/password/BreachResult'
import ErrorMessage from '../components/shared/ErrorMessage'
import { analyzePassword, checkBreach } from '../services/api'

async function sha1(str) {
  const buffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

export default function PasswordPage() {
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [breach,   setBreach]   = useState(null)

  async function handleAnalyse(password) {
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setBreach(null)
    try {
      const hash = await sha1(password)
      const [analysisRes, breachRes] = await Promise.all([
        analyzePassword(password),
        checkBreach(hash),
      ])
      setAnalysis(analysisRes.data)
      setBreach(breachRes.data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Password Strength Analyser</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Check any password for entropy, weak patterns, and known data breaches.
          Analysis runs on your own server instance — your password is never stored.
          Breach checks use <span className="text-gray-700 dark:text-gray-300">k-anonymity</span>: only
          the first 5 characters of a SHA-1 hash are sent to Have I Been Pwned, so
          your full password never leaves your browser.
        </p>
      </div>

      <PasswordForm onSubmit={handleAnalyse} loading={loading} />

      {error && <ErrorMessage message={error} />}

      {analysis && (
        <>
          <StrengthBar score={analysis.score} label={analysis.label} />

          <EntropyGauge
            entropy={analysis.entropy}
            effectiveEntropy={analysis.effectiveEntropy}
            entropyLabel={analysis.entropyLabel}
          />

          <PatternWarnings
            patterns={analysis.patterns}
            feedback={analysis.feedback}
            crackTime={analysis.crackTime}
          />

          <BreachResult breach={breach} />
        </>
      )}
    </div>
  )
}
