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
      window.umami?.track('scan_submitted')
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
          <div className="hidden sm:flex w-10 h-10 rounded bg-lime-50 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-mono-cyber text-lime-700 dark:text-lime-500 tracking-widest uppercase mb-1">
              Web Security Scanner
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f2f2f2]">Security Header + Port Scan</h1>
            <p className="text-sm text-gray-600 dark:text-[#888] mt-2 leading-relaxed max-w-2xl">
              Analyse any public website for HTTP security headers, open ports, and known
              vulnerability patterns. A scored A-F report with actionable recommendations is
              generated in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded border border-amber-300/40 dark:border-amber-500/15 bg-amber-50/50 dark:bg-amber-500/[0.04] px-4 py-3">
          <span className="text-amber-600/90 dark:text-amber-500/70 shrink-0 mt-0.5 text-sm font-mono-cyber">!</span>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/60 leading-relaxed">
            <span className="font-semibold text-amber-900 dark:text-amber-200/90">Authorisation required.</span>{' '}
            Only scan websites you own or have explicit permission to test.
            Unauthorised port scanning may be illegal in your jurisdiction.
            Private and local IP ranges are blocked.
          </p>
        </div>
      </Panel>

      <ScannerForm onSubmit={handleScan} loading={loading} />

      {error && <ErrorMessage message={error} />}

      {loading && (
        <Panel className="p-5">
          <div className="flex items-center gap-3 font-mono-cyber text-sm text-gray-600 dark:text-[#888]">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>Scanning ports, this may take a moment...</span>
          </div>
        </Panel>
      )}

      {report && (
        <>
          <Panel hover className="flex items-center gap-6 p-6 animate-fade-up">
            <ScoreCircle score={report.totalScore} grade={report.grade} />
            <div>
              <p className="text-xs font-mono-cyber text-lime-700 dark:text-lime-500 tracking-widest uppercase">
                Target
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-[#f2f2f2] mt-1 font-mono-cyber break-all">{report.url}</p>
              <p className="text-sm text-gray-500 dark:text-[#555] mt-1">
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
