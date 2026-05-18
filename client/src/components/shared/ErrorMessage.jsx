export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg p-4">
      <span className="text-lg leading-none mt-0.5">✕</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
