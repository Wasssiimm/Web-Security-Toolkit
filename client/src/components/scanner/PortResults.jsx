import Badge from '../shared/Badge'

const STATE_PILL = {
  open:     'bg-lime-50 text-lime-700 border border-lime-200 dark:bg-lime-900/25 dark:text-lime-400 dark:border-lime-800/60',
  closed:   'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-[#1a1a1a] dark:text-[#555] dark:border-[#222]',
  filtered: 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-[#1a1a1a] dark:text-[#555] dark:border-[#222]',
}

export default function PortResults({ host, ports }) {
  if (!ports) return null

  const openCount = ports.filter(p => p.state === 'open').length

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1e1e1e] flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-[#f2f2f2] flex items-center gap-2">
            <span className="text-lime-500 dark:text-lime-400 font-mono-cyber">+</span>
            Port Scan
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#555] mt-0.5 font-mono-cyber">{host}</p>
        </div>
        <span className="text-xs font-mono-cyber text-lime-700 dark:text-lime-500 px-2 py-1 border border-lime-200 dark:border-lime-800/50 rounded bg-lime-50 dark:bg-lime-400/8">
          {openCount} open
        </span>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-[#161616]">
        {ports.map(p => {
          const isOpen = p.state === 'open'
          return (
            <div
              key={p.port}
              className={`flex items-center gap-4 px-5 py-3 ${!isOpen ? 'opacity-35' : ''}`}
            >
              <span className="w-14 text-sm font-mono-cyber text-gray-600 dark:text-[#888] shrink-0">
                {p.port}
              </span>

              <span className="w-24 text-sm text-gray-600 dark:text-[#666] shrink-0">
                {p.service}
              </span>

              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${STATE_PILL[p.state] ?? STATE_PILL.filtered}`}>
                {p.state.charAt(0).toUpperCase() + p.state.slice(1)}
              </span>

              {isOpen && p.risk !== 'none' && (
                <div className="flex items-center gap-2 min-w-0">
                  <Badge severity={p.risk}>{p.risk}</Badge>
                  {p.risk_desc && (
                    <span className="text-xs text-gray-500 dark:text-[#555] truncate">{p.risk_desc}</span>
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
