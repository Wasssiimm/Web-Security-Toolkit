export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-400/25 text-red-700 dark:text-red-400 rounded p-4">
      <span className="font-mono-cyber text-red-500 shrink-0 mt-0.5 text-sm">[!]</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
