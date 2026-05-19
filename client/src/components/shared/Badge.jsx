const STYLES = {
  critical: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  high:     'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  medium:   'bg-yellow-50 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  low:      'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  safe:     'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  none:     'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
}

export default function Badge({ severity = 'none', children }) {
  const cls = STYLES[severity] ?? STYLES.none
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
