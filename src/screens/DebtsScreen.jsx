import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { fmtKES } from '../utils/formatters'

const AVATAR_COLORS = ['blue', 'amber', 'red', 'purple', 'green']

export default function DebtsScreen() {
  const navigate = useNavigate()
  const customers = useAppStore((s) => s.customers)

  const active = [...customers]
    .filter((c) => c.totalOwed > 0)
    .sort((a, b) => b.totalOwed - a.totalOwed)
  const cleared = customers.filter((c) => c.totalOwed === 0)
  const total = customers.reduce((a, c) => a + c.totalOwed, 0)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>Debts</h1>
        {total > 0 && (
          <span
            style={{
              background: 'var(--red-bg)',
              color: 'var(--red-text)',
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 9px',
              borderRadius: 12,
            }}
          >
            {fmtKES(total)} total
          </span>
        )}
      </div>

      {active.length === 0 && cleared.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 24 }}>
          <Icon
            name="users"
            size={32}
            color="var(--text-secondary)"
            style={{ display: 'block', margin: '0 auto 8px' }}
          />
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
            No customers yet
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Add customers when classifying transactions as debts
          </p>
        </Card>
      )}

      {active.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}
          >
            Active debts
          </p>
          {active.map((c, i) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customer/${c.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <Avatar name={c.name} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {c.payments.length} payment{c.payments.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--red)' }}>
                  {fmtKES(c.totalOwed)}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-secondary)' }}>owed</p>
              </div>
              <Icon name="chevronRight" size={16} color="var(--text-secondary)" />
            </div>
          ))}
        </div>
      )}

      {cleared.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              margin: '12px 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}
          >
            Cleared
          </p>
          {cleared.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customer/${c.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                marginBottom: 8,
                cursor: 'pointer',
                opacity: 0.65,
              }}
            >
              <Avatar name={c.name} color="green" size={36} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Fully paid</p>
              </div>
              <Icon name="chevronRight" size={16} color="var(--text-secondary)" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
