import { useState } from 'react'
import ScannerForm from '../components/scanner/ScannerForm'
import HeaderResults from '../components/scanner/HeaderResults'
import PortResults from '../components/scanner/PortResults'
import VulnList from '../components/scanner/VulnList'
import ReportCard from '../components/scanner/ReportCard'
import ErrorMessage from '../components/shared/ErrorMessage'
import ScoreCircle from '../components/shared/ScoreCircle'
import Panel from '../components/shared/Panel'
import { scanReport } from '../services/api'

export default function ScannerPage() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [report,  setReport]  = useState(null)

  async function handleScan(url) {
    setLoading(true)
    setError(null)
    setReport(null)
    try {
      const { data } = await scanReport(url)
      setReport(data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <Panel className="p-7 space-y-5">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-md bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-1">
              &gt; SCAN.v2 // ACTIVE
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Web Security Scanner</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
              Analyse any public website for HTTP security headers, open ports, and known
              vulnerability patterns. A scored report with actionable recommendations is
              generated in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300/60 dark:border-yellow-400/30 rounded-md px-4 py-3">
          <span className="text-yellow-500 shrink-0 mt-0.5">⚠</span>
          <p className="text-sm text-yellow-800 dark:text-yellow-200/90">
            <span className="font-mono-cyber font-semibold">AUTHORISATION REQUIRED:</span>{' '}
            Only scan websites you own or have explicit permission to test.
            Unauthorised port scanning may be illegal in your jurisdiction.
            Private and local IP ranges are blocked by this tool.
          </p>
        </div>
      </Panel>

      <ScannerForm onSubmit={handleScan} loading={loading} />

      {error && <ErrorMessage message={error} />}

      {loading && (
        <Panel className="p-5">
          <div className="flex items-center gap-3 font-mono-cyber text-sm text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse-glow" />
            <span className="animate-pulse">Scanning ports, this may take a moment…</span>
          </div>
        </Panel>
      )}

      {report && (
        <>
          <Panel hover className="flex items-center gap-6 p-6 animate-fade-up">
            <ScoreCircle score={report.totalScore} grade={report.grade} />
            <div>
              <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
                TARGET
              </p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white mt-1 font-mono-cyber break-all">{report.url}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Scanned {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
          </Panel>

          <HeaderResults
            headers={report.headers}
            headerScore={report.headerScore}
            maxHeaderScore={report.maxHeaderScore}
          />

          <PortResults host={report.host} ports={report.ports} />
          <VulnList vulnerabilities={report.vulnerabilities} />
          <ReportCard report={report} />
        </>
      )}
    </div>
  )
}
