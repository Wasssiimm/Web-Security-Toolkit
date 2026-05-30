export default function CorvexLogo({ size = 40, className = '' }) {
  return (
    <img
      src="/corvex.png"
      alt="Corvex Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
