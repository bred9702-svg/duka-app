import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './ui/Icon'
import useAppStore from '../store/useAppStore'

const TABS = [
  { id: 'home', path: '/', icon: 'home', label: 'Home' },
  { id: 'inbox', path: '/inbox', icon: 'inbox', label: 'Inbox' },
  { id: 'debts', path: '/debts', icon: 'users', label: 'Debts' },
  { id: 'settings', path: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const transactions = useAppStore((s) => s.transactions)
  const unclassifiedCount = transactions.filter((t) => !t.classified).length

  return (
    <div
      style={{
        display: 'flex',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '8px 0 10px',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}
    >
      {TABS.map((tab) => {
        const active = location.pathname === tab.path
        return (
          <div
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon
                name={tab.icon}
                size={21}
                color={active ? 'var(--blue)' : 'var(--text-secondary)'}
              />
              {tab.id === 'inbox' && unclassifiedCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -5,
                    width: 7,
                    height: 7,
                    background: 'var(--red)',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 9,
                color: active ? 'var(--blue)' : 'var(--text-secondary)',
                fontWeight: active ? 500 : 400,
              }}
            >
              {tab.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
