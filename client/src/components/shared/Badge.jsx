const STYLES = {
  critical: 'bg-red-900/30 text-red-400 border border-red-800',
  high:     'bg-orange-900/30 text-orange-400 border border-orange-800',
  medium:   'bg-yellow-900/30 text-yellow-400 border border-yellow-800',
  low:      'bg-blue-900/30 text-blue-400 border border-blue-800',
  safe:     'bg-green-900/30 text-green-400 border border-green-800',
  none:     'bg-gray-800 text-gray-400 border border-gray-700',
}

export default function Badge({ severity = 'none', children }) {
  const cls = STYLES[severity] ?? STYLES.none
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
