export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="relative flex items-start gap-3 bg-red-50/70 dark:bg-red-500/10 backdrop-blur-sm border border-red-300/60 dark:border-red-400/30 text-red-700 dark:text-red-300 rounded-md p-4 shadow-[0_0_30px_-10px_rgba(239,68,68,0.4)]">
      <span className="font-mono-cyber text-red-500 dark:text-red-400 shrink-0 mt-0.5">[!]</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
