export default function CorvexLogo({ size = 40, className = '' }) {
  return (
    <img
      src="/crucexv3.png"
      alt="Crucex"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
