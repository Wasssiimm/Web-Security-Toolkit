import Badge from '../shared/Badge'

const STATE_PILL = {
  open:     'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  closed:   'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700',
  filtered: 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700',
}

export default function PortResults({ host, ports }) {
  if (!ports) return null

  const openCount = ports.filter(p => p.state === 'open').length

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Port Scan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{host}</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{openCount} open</span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {ports.map(p => {
          const isOpen = p.state === 'open'
          return (
            <div
              key={p.port}
              className={`flex items-center gap-4 px-5 py-3 ${!isOpen ? 'opacity-40' : ''}`}
            >
              <span className="w-14 text-sm font-mono text-gray-600 dark:text-gray-300 shrink-0">
                {p.port}
              </span>

              <span className="w-24 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                {p.service}
              </span>

              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${STATE_PILL[p.state] ?? STATE_PILL.filtered}`}>
                {p.state.charAt(0).toUpperCase() + p.state.slice(1)}
              </span>

              {isOpen && p.risk !== 'none' && (
                <div className="flex items-center gap-2 min-w-0">
                  <Badge severity={p.risk}>{p.risk}</Badge>
                  {p.risk_desc && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{p.risk_desc}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
