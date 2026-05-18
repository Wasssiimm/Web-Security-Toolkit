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
