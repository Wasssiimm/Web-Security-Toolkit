import Badge from '../shared/Badge'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function VulnList({ vulnerabilities }) {
  if (!vulnerabilities) return null

  if (vulnerabilities.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg px-5 py-6 text-center">
        <p className="text-cyan-400 font-medium">No vulnerabilities detected</p>
        <p className="text-sm text-gray-400 mt-1">The scanned target passed all checks.</p>
      </div>
    )
  }

  const sorted = [...vulnerabilities].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
  )

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-gray-100">Vulnerabilities</h2>
        <span className="text-sm text-gray-400">{vulnerabilities.length} found</span>
      </div>

      <div className="divide-y divide-gray-800">
        {sorted.map(v => (
          <div key={v.id} className="px-5 py-4 flex gap-4">
            <div className="pt-0.5 shrink-0">
              <Badge severity={v.severity}>{v.severity}</Badge>
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-sm font-semibold text-gray-100">{v.title}</p>
              <p className="text-sm text-gray-400">{v.description}</p>
              <p className="text-sm text-gray-400 pl-3 border-l border-gray-700">
                <span className="text-cyan-400 mr-1">→</span>
                {v.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
