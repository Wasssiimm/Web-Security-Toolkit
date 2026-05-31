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
    <div className="panel px-5 py-4 flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-mono-cyber">
        // generated {new Date(report.generatedAt).toLocaleString()}
      </p>
      <button
        onClick={downloadJSON}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-md transition-all"
      >
        <span className="font-mono-cyber text-xs text-cyan-600 dark:text-cyan-400">↓</span>
        Export JSON
      </button>
    </div>
  )
}
