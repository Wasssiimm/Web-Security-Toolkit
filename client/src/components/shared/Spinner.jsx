const SIZES = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

export default function Spinner({ size = 'sm' }) {
  return (
    <span
      className={`inline-block ${SIZES[size] ?? SIZES.sm} border-2 border-gray-600 border-t-green-400 rounded-full animate-spin`}
    />
  )
}
