import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import TransactionRow from '../components/transactions/TransactionRow'
import { fmtKES, fmtDateLong, newId } from '../utils/formatters'

const MPESA_AMOUNTS = [500, 800, 1000, 1500, 2000, 2500]

export default function HomeScreen() {
  const navigate = useNavigate()
  const transactions = useAppStore((s) => s.transactions)
  const customers = useAppStore((s) => s.customers)
  const addTransaction = useAppStore((s) => s.addTransaction)
  const [simulating, setSimulating] = useState(false)

  const today = transactions.filter((t) => Date.now() - t.ts < 86400000)
  const income = today
    .filter(
      (t) =>
        t.direction === 'in' &&
        t.classified &&
        t.classification?.type !== 'debt'
    )
    .reduce((a, t) => a + t.amount, 0)
  const expenses = today
    .filter((t) => t.direction === 'out' && t.classified)
    .reduce((a, t) => a + t.amount, 0)
  const profit = income - expenses
  const totalOwed = customers.reduce((a, c) => a + c.totalOwed, 0)
  const unclassified = transactions.filter((t) => !t.classified)
  const recent = transactions.slice(0, 5)

  function simulateMpesa() {
    setSimulating(true)
    setTimeout(() => {
      addTransaction({
        id: newId('t'),
        amount: MPESA_AMOUNTS[Math.floor(Math.random() * MPESA_AMOUNTS.length)],
        source: 'mpesa',
        direction: 'in',
        ts: Date.now(),
        classified: false,
        classification: null,
      })
      setSimulating(false)
      navigate('/inbox')
    }, 900)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {fmtDateLong(Date.now())}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 500, marginTop: 1 }}>
            Today's overview
          </h1>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="store" size={18} color="#fff" />
        </div>
      </div>

      <Card
        style={{
          marginBottom: 10,
          background: profit >= 0 ? 'var(--green-bg)' : 'var(--red-bg)',
          border: `1px solid ${profit >= 0 ? 'var(--green-border)' : 'var(--red-border)'}`,
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: profit >= 0 ? 'var(--green-text)' : 'var(--red-text)',
            marginBottom: 2,
          }}
        >
          Net profit today
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: profit >= 0 ? 'var(--green)' : 'var(--red)',
            marginBottom: 2,
          }}
        >
          {fmtKES(profit)}
        </p>
        <p
          style={{
            fontSize: 10,
            color: profit >= 0 ? 'var(--green-text)' : 'var(--red-text)',
          }}
        >
          {profit >= 0 ? 'Looking good' : 'Expenses exceed income'}
        </p>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <StatCard
          label="Income"
          value={fmtKES(income)}
          sub={`${today.filter((t) => t.classified && t.direction === 'in').length} transactions`}
          color="green"
        />
        <StatCard
          label="Expenses"
          value={fmtKES(expenses)}
          sub={`${today.filter((t) => t.classified && t.direction === 'out').length} items`}
          color="red"
        />
        <StatCard
          label="Debts owed"
          value={fmtKES(totalOwed)}
          sub={`${customers.filter((c) => c.totalOwed > 0).length} customers`}
          color="amber"
        />
        <StatCard
          label="Unclassified"
          value={unclassified.length}
          sub={unclassified.length ? 'Needs review →' : 'All clear'}
          color={unclassified.length ? 'red' : 'green'}
        />
      </div>

      <button
        onClick={simulateMpesa}
        disabled={simulating}
        style={{
          width: '100%',
          background: simulating ? 'var(--green-bg)' : 'var(--green)',
          color: simulating ? 'var(--green)' : '#fff',
          border: 'none',
          borderRadius: 10,
          padding: 10,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Icon name={simulating ? 'loader' : 'phone'} size={15} spin={simulating} />
        {simulating ? 'Simulating M-Pesa...' : 'Simulate M-Pesa payment'}
      </button>

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
        Recent transactions
      </p>
      {recent.map((t) => (
        <TransactionRow
          key={t.id}
          txn={t}
          customers={customers}
          onClick={!t.classified ? () => navigate(`/classify/${t.id}`) : undefined}
        />
      ))}
    </div>
  )
}
