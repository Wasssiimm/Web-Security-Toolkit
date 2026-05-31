import Badge from '../shared/Badge'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function VulnList({ vulnerabilities }) {
  if (!vulnerabilities) return null

  if (vulnerabilities.length === 0) {
    return (
      <div className="panel panel-emerald px-5 py-6 text-center">
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
          <span className="font-mono-cyber">[ ✓ ]</span> No vulnerabilities detected
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The scanned target passed all checks.</p>
      </div>
    )
  }

  const sorted = [...vulnerabilities].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
  )

  return (
    <div className="panel panel-fuchsia overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-fuchsia-500 dark:text-fuchsia-400 font-mono-cyber">▸</span>
          Vulnerabilities
        </h2>
        <span className="text-xs font-mono-cyber text-fuchsia-600 dark:text-fuchsia-400 px-2 py-1 border border-fuchsia-300/40 dark:border-fuchsia-400/30 rounded">
          {vulnerabilities.length} FOUND
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {sorted.map(v => (
          <div key={v.id} className="px-5 py-4 flex gap-4">
            <div className="pt-0.5 shrink-0">
              <Badge severity={v.severity}>{v.severity}</Badge>
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{v.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{v.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 pl-3 border-l border-gray-200 dark:border-gray-700">
                <span className="text-cyan-500 dark:text-cyan-400 mr-1">→</span>
                {v.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
