import { useState } from 'react'
import PasswordForm from '../components/password/PasswordForm'
import StrengthBar from '../components/password/StrengthBar'
import EntropyGauge from '../components/password/EntropyGauge'
import PatternWarnings from '../components/password/PatternWarnings'
import BreachResult from '../components/password/BreachResult'
import ErrorMessage from '../components/shared/ErrorMessage'
import Panel from '../components/shared/Panel'
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
    <div className="space-y-6 animate-fade-up">
      <Panel accent="fuchsia" className="p-7">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-md bg-fuchsia-100 dark:bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-mono-cyber text-fuchsia-600 dark:text-fuchsia-400 tracking-widest uppercase mb-1">
              &gt; PWD.x86 // ENTROPY
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Password Strength Analyser</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
              Check any password for entropy, weak patterns, and known data breaches.
              Analysis runs on your own server instance — your password is never stored.
              Breach checks use <span className="font-mono-cyber text-fuchsia-600 dark:text-fuchsia-300">k-anonymity</span>: only
              the first 5 characters of a SHA-1 hash are sent to Have I Been Pwned, so
              your full password never leaves your browser.
            </p>
          </div>
        </div>
      </Panel>

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
