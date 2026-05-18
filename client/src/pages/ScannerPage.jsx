import { useState } from 'react'
import ScannerForm from '../components/scanner/ScannerForm'
import HeaderResults from '../components/scanner/HeaderResults'
import PortResults from '../components/scanner/PortResults'
import VulnList from '../components/scanner/VulnList'
import ReportCard from '../components/scanner/ReportCard'
import ErrorMessage from '../components/shared/ErrorMessage'
import ScoreCircle from '../components/shared/ScoreCircle'
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
    <div className="space-y-6">
      <ScannerForm onSubmit={handleScan} loading={loading} />

      {error && <ErrorMessage message={error} />}

      {loading && (
        <p className="text-sm text-gray-400 animate-pulse">
          Scanning ports, this may take a moment…
        </p>
      )}

      {report && (
        <>
          {/* Score summary — stays here permanently */}
          <div className="flex items-center gap-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <ScoreCircle score={report.totalScore} grade={report.grade} />
            <div>
              <p className="text-lg font-semibold text-gray-100">{report.url}</p>
              <p className="text-sm text-gray-400 mt-1">
                Scanned {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>

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
