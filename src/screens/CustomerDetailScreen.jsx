import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import BackButton from '../components/ui/BackButton'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import { fmtKES, fmtShortDate, newId } from '../utils/formatters'

export default function CustomerDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customers = useAppStore((s) => s.customers)
  const addTransaction = useAppStore((s) => s.addTransaction)
  const addDebtPayment = useAppStore((s) => s.addDebtPayment)
  const [amount, setAmount] = useState('')

  const customer = customers.find((c) => c.id === id)

  if (!customer) {
    return (
      <div style={{ flex: 1, padding: 24 }}>
        <BackButton to="/debts" />
        <p>Customer not found.</p>
      </div>
    )
  }

  function recordPayment() {
    const amt = parseInt(amount, 10)
    if (!amt || amt <= 0) return
    const txn = {
      id: newId('t'),
      amount: amt,
      source: 'cash',
      direction: 'in',
      ts: Date.now(),
      classified: true,
      classification: {
        type: 'debt',
        customerId: customer.id,
        productName: null,
        quantity: null,
        category: null,
      },
    }
    addTransaction(txn)
    addDebtPayment(customer.id, amt, txn.id)
    setAmount('')
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px' }}>
      <BackButton to="/debts" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar name={customer.name} size={44} />
        <div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{customer.name}</p>
          {customer.phone && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{customer.phone}</p>
          )}
        </div>
      </div>

      <Card
        style={{
          background: customer.totalOwed > 0 ? 'var(--amber-bg)' : 'var(--green-bg)',
          border: `1px solid ${customer.totalOwed > 0 ? 'var(--amber-border)' : 'var(--green-border)'}`,
          marginBottom: 14,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
          Current balance
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: customer.totalOwed > 0 ? 'var(--amber)' : 'var(--green)',
          }}
        >
          {fmtKES(customer.totalOwed)}
        </p>
        {customer.totalOwed === 0 && (
          <p style={{ fontSize: 12, color: 'var(--green-text)', marginTop: 4 }}>
            Fully paid
          </p>
        )}
      </Card>

      {customer.totalOwed > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Record payment
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Amount (KES)"
              style={{
                flex: 1,
                border: '1px solid var(--border-strong)',
                borderRadius: 8,
                padding: '9px 11px',
                fontSize: 13,
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={recordPayment}
              disabled={!amount}
              style={{
                background: 'var(--green)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 14px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                opacity: amount ? 1 : 0.5,
              }}
            >
              Record
            </button>
          </div>
        </div>
      )}

      {customer.payments.length > 0 ? (
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
            Payment history
          </p>
          {customer.payments.map((p, i) => (
            <Card
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {fmtShortDate(p.date)}
              </p>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>
                +{fmtKES(p.amount)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '16px 0',
          }}
        >
          No payments yet
        </p>
      )}
    </div>
  )
}
