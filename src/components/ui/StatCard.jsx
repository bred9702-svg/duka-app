import Card from './Card'

const COLORS = {
  green: 'var(--green)',
  red: 'var(--red)',
  amber: 'var(--amber)',
  default: 'var(--text-primary)',
}

export default function StatCard({ label, value, sub, color = 'default' }) {
  return (
    <Card style={{ padding: '10px 12px' }}>
      <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 3 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: COLORS[color] || COLORS.default,
          marginBottom: 2,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{sub}</p>
      )}
    </Card>
  )
}
