export default function BreachResult({ breach }) {
  if (!breach) return null

  return (
    <div className={`rounded-lg border p-5 space-y-3 ${
      breach.breached
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{breach.breached ? '✕' : '✓'}</span>
        <p className={`font-semibold ${breach.breached ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          {breach.message}
        </p>
      </div>

      {breach.breached && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This password appears in known data breach databases. Attackers use these
          lists in credential stuffing attacks — do not use it anywhere.
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3">
        Your password was never transmitted. Only the first 5 characters of its SHA-1
        hash were sent to Have I Been Pwned — this is called k-anonymity.
      </p>
    </div>
  )
}
