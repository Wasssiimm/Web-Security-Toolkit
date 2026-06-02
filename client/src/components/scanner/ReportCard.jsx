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
    window.umami?.track('report_exported')
  }

  return (
    <div className="panel px-5 py-4 flex items-center justify-between">
      <p className="text-xs text-gray-500 dark:text-[#555] font-mono-cyber">
        generated {new Date(report.generatedAt).toLocaleString()}
      </p>
      <button
        onClick={downloadJSON}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-[#ccc] text-sm font-medium px-4 py-2 rounded transition-all"
      >
        <span className="font-mono-cyber text-xs text-lime-700 dark:text-lime-400">↓</span>
        Export JSON
      </button>
    </div>
  )
}
