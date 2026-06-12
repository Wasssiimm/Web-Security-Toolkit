export default function Panel({
  children,
  className = '',
  accent,
  hover = false,
  as: Tag = 'div',
}) {
  return (
    <Tag className={`panel ${hover ? 'panel-hover' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
