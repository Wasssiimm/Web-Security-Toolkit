export default function ReportCard({ report }) {
  if (!report) return null

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-5 py-4 flex items-center justify-between">
      <p className="text-sm text-gray-400">
        Generated {new Date(report.generatedAt).toLocaleString()}
      </p>
      <button
        onClick={downloadJSON}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Export JSON
      </button>
    </div>
  )
}
