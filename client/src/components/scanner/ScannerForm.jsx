import Spinner from '../shared/Spinner'

export default function ScannerForm({ onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    const url = e.target.url.value.trim()
    if (url) onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="url"
        name="url"
        placeholder="https://example.com"
        required
        disabled={loading}
        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
      >
        {loading && <Spinner size="sm" />}
        {loading ? 'Scanning…' : 'Scan'}
      </button>
    </form>
  )
}
