const VARIANTS = {
  warn: { background: '#fef3dc', color: '#8a5500' },
  ok: { background: '#e6f7f0', color: '#0d6b47' },
  info: { background: '#eff6ff', color: '#1e40af' },
  red: { background: '#fdeaea', color: '#9b2c2c' },
  gray: { background: '#f1f0ee', color: '#5f5e5a' },
}

export default function Badge({ children, variant = 'gray' }) {
  const style = VARIANTS[variant] || VARIANTS.gray
  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 7px',
        borderRadius: 10,
        display: 'inline-block',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
