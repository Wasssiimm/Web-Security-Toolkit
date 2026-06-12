import Badge from '../shared/Badge'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function VulnList({ vulnerabilities }) {
  if (!vulnerabilities) return null

  if (vulnerabilities.length === 0) {
    return (
      <div className="panel px-5 py-6 text-center">
        <p className="text-lime-700 dark:text-lime-400 font-semibold flex items-center justify-center gap-2 text-sm">
          <span className="font-mono-cyber">[ + ]</span> No vulnerabilities detected
        </p>
        <p className="text-sm text-gray-600 dark:text-[#888] mt-1">The scanned target passed all checks.</p>
      </div>
    )
  }

  const sorted = [...vulnerabilities].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
  )

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1e1e1e] flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-[#f2f2f2] flex items-center gap-2">
          <span className="text-red-500 dark:text-red-400 font-mono-cyber">!</span>
          Vulnerabilities
        </h2>
        <span className="text-xs font-mono-cyber text-red-600 dark:text-red-400 px-2 py-1 border border-red-200 dark:border-red-800/50 rounded bg-red-50 dark:bg-red-400/8">
          {vulnerabilities.length} found
        </span>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-[#161616]">
        {sorted.map(v => (
          <div key={v.id} className="px-5 py-4 flex gap-4">
            <div className="pt-0.5 shrink-0">
              <Badge severity={v.severity}>{v.severity}</Badge>
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-[#f2f2f2]">{v.title}</p>
              <p className="text-sm text-gray-600 dark:text-[#888]">{v.description}</p>
              <p className="text-sm text-gray-600 dark:text-[#888] pl-3 border-l border-gray-200 dark:border-[#222]">
                <span className="text-lime-500 dark:text-lime-400 mr-1">+</span>
                {v.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
