import { Fragment, useState } from 'react'
import Badge from '../shared/Badge'

const QUALITY_SEVERITY = {
  good:          'safe',
  weak:          'medium',
  misconfigured: 'high',
}

function formatKey(key) {
  return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
}

export default function HeaderResults({ headers, headerScore, maxHeaderScore }) {
  const [expanded, setExpanded] = useState(null)

  if (!headers) return null

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-cyan-500 dark:text-cyan-400 font-mono-cyber">▸</span>
          Security Headers
        </h2>
        <span className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 px-2 py-1 border border-cyan-300/40 dark:border-cyan-400/30 rounded">
          {headerScore} / {maxHeaderScore} PRESENT
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-mono-cyber text-slate-400 dark:text-slate-500 uppercase border-b border-slate-200 dark:border-white/5">
            <th className="px-5 py-3 font-medium">Header</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Quality</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(headers).map(([key, data]) => {
            const isOpen = expanded === key
            return (
              <Fragment key={key}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-mono text-gray-700 dark:text-gray-200">
                    {formatKey(key)}
                    <span className="ml-2 text-gray-400 dark:text-gray-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </td>
                  <td className="px-5 py-3">
                    {data.present
                      ? <Badge severity="safe">Present</Badge>
                      : <Badge severity="critical">Missing</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    {data.present && data.quality
                      ? <Badge severity={QUALITY_SEVERITY[data.quality] ?? 'none'}>
                          {data.quality}
                        </Badge>
                      : data.recommendation
                        ? <span className="text-xs text-gray-400 dark:text-gray-500">→ {data.recommendation}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </td>
                </tr>

                {isOpen && (
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                    <td colSpan={3} className="px-5 py-4 space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{data.desc}</p>

                      {data.value && (
                        <p className="text-xs font-mono bg-gray-100 dark:bg-gray-950 rounded px-3 py-2 text-cyan-600 dark:text-cyan-300 break-all">
                          {data.value}
                        </p>
                      )}

                      {data.issues?.length > 0 && (
                        <ul className="space-y-1">
                          {data.issues.map((issue, i) => (
                            <li key={i} className="text-xs text-yellow-600 dark:text-yellow-400 flex gap-2">
                              <span>⚠</span><span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {!data.present && data.recommendation && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="text-cyan-500 dark:text-cyan-400 mr-1">→</span>
                          {data.recommendation}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
