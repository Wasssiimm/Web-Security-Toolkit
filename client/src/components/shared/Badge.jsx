const STYLES = {
  critical: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/25 dark:text-red-400 dark:border-red-800/60',
  high:     'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/25 dark:text-orange-400 dark:border-orange-800/60',
  medium:   'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/25 dark:text-yellow-400 dark:border-yellow-800/60',
  low:      'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/25 dark:text-blue-400 dark:border-blue-800/60',
  safe:     'bg-lime-50 text-lime-700 border border-lime-200 dark:bg-lime-900/25 dark:text-lime-400 dark:border-lime-800/60',
  none:     'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-[#1a1a1a] dark:text-[#888] dark:border-[#2a2a2a]',
}

export default function Badge({ severity = 'none', children }) {
  const cls = STYLES[severity] ?? STYLES.none
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
