export default function Panel({
  children,
  className = '',
  accent = 'cyan',
  hover = false,
  as: Tag = 'div',
}) {
  const accentClass =
    accent === 'fuchsia' ? 'panel-fuchsia'
    : accent === 'emerald' ? 'panel-emerald'
    : ''

  return (
    <Tag className={`panel ${accentClass} ${hover ? 'panel-glow' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
