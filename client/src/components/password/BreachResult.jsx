export default function BreachResult({ breach }) {
  if (!breach) return null

  return (
    <div className={`relative rounded-md border p-5 space-y-3 backdrop-blur-sm ${
      breach.breached
        ? 'bg-red-50/70 dark:bg-red-500/10 border-red-300/60 dark:border-red-400/30 shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)]'
        : 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-300/60 dark:border-emerald-400/30 shadow-[0_0_30px_-10px_rgba(52,211,153,0.5)]'
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
