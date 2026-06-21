import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import TransactionRow from '../components/transactions/TransactionRow'
import { newId } from '../utils/formatters'

export default function TransactionsScreen() {
  const navigate = useNavigate()
  const transactions = useAppStore((s) => s.transactions)
  const customers = useAppStore((s) => s.customers)
  const addTransaction = useAppStore((s) => s.addTransaction)

  const unclassified = transactions.filter((t) => !t.classified)
  const classified = transactions.filter((t) => t.classified)

  function addCash(direction) {
    const raw = window.prompt(
      (direction === 'in' ? 'Cash received' : 'Cash paid out') +
        ' — enter amount in KES:'
    )
    if (!raw) return
    const amount = parseInt(raw.replace(/[^0-9]/g, ''), 10)
    if (!amount || amount <= 0) {
      window.alert('Invalid amount')
      return
    }
    addTransaction({
      id: newId('t'),
      amount,
      source: 'cash',
      direction,
      ts: Date.now(),
      classified: false,
      classification: null,
    })
  }

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
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>Inbox</h1>
        {unclassified.length > 0 && (
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
            {unclassified.length} to classify
          </span>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <button
          onClick={() => addCash('in')}
          style={{
            background: 'var(--green-bg)',
            color: 'var(--green-text)',
            border: '1px solid var(--green-border)',
            borderRadius: 10,
            padding: '10px 8px',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <Icon name="plus" size={15} /> Cash in
        </button>
        <button
          onClick={() => addCash('out')}
          style={{
            background: 'var(--red-bg)',
            color: 'var(--red-text)',
            border: '1px solid var(--red-border)',
            borderRadius: 10,
            padding: '10px 8px',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <Icon name="minus" size={15} /> Cash out
        </button>
      </div>

      {unclassified.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 24, marginBottom: 12 }}>
          <Icon
            name="circleCheck"
            size={32}
            color="var(--green)"
            style={{ display: 'block', margin: '0 auto 8px' }}
          />
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
            All clear
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            No transactions to classify
          </p>
        </Card>
      ) : (
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
            Needs classification
          </p>
          {unclassified.map((t) => (
            <TransactionRow
              key={t.id}
              txn={t}
              customers={customers}
              onClick={() => navigate(`/classify/${t.id}`)}
            />
          ))}
        </div>
      )}

      {classified.length > 0 && (
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
            Classified
          </p>
          {classified.map((t) => (
            <TransactionRow key={t.id} txn={t} customers={customers} />
          ))}
        </div>
      )}
    </div>
  )
}
