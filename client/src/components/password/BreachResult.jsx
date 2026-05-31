export default function BreachResult({ breach }) {
  if (!breach) return null

  return (
    <div className={`rounded border p-6 space-y-3 ${
      breach.breached
        ? 'bg-red-50 dark:bg-red-500/8 border-red-200 dark:border-red-400/25'
        : 'bg-lime-50 dark:bg-lime-500/8 border-lime-200 dark:border-lime-400/25'
    }`}>
      <div className="flex items-center gap-3">
        <span className={`font-mono-cyber text-sm font-bold ${breach.breached ? 'text-red-500 dark:text-red-400' : 'text-lime-700 dark:text-lime-400'}`}>
          {breach.breached ? '!' : '+'}
        </span>
        <p className={`font-semibold text-sm ${breach.breached ? 'text-red-700 dark:text-red-400' : 'text-lime-700 dark:text-lime-400'}`}>
          {breach.message}
        </p>
      </div>

      {breach.breached && (
        <p className="text-sm text-gray-600 dark:text-[#888]">
          This password appears in known data breach databases. Attackers use these
          lists in credential stuffing attacks. Do not use it anywhere.
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-[#555] border-t border-gray-200 dark:border-[#1e1e1e] pt-3 font-mono-cyber">
        Your password was never transmitted. Only the first 5 characters of its SHA-1
        hash were sent to Have I Been Pwned. This is k-anonymity.
      </p>
    </div>
  )
}
