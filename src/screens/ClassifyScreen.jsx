import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import BackButton from '../components/ui/BackButton'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Avatar from '../components/ui/Avatar'
import { fmtKES, fmtTime, newId } from '../utils/formatters'
import { EXPENSE_CATEGORIES } from '../data/mockData'

const TYPE_OPTS = [
  { id: 'sale', icon: 'bag', label: 'Sale', color: 'var(--green)', bg: 'var(--green-bg)' },
  { id: 'debt', icon: 'userDollar', label: 'Debt', color: 'var(--amber)', bg: 'var(--amber-bg)' },
  { id: 'expense', icon: 'receiptOff', label: 'Expense', color: 'var(--red)', bg: 'var(--red-bg)' },
]

export default function ClassifyScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const transactions = useAppStore((s) => s.transactions)
  const customers = useAppStore((s) => s.customers)
  const classifyTransaction = useAppStore((s) => s.classifyTransaction)
  const addCustomer = useAppStore((s) => s.addCustomer)
  const addDebtPayment = useAppStore((s) => s.addDebtPayment)
  const increaseDebt = useAppStore((s) => s.increaseDebt)

  const txn = transactions.find((t) => t.id === id)

  const [type, setType] = useState(null)
  const [product, setProduct] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState(null)
  const [customerId, setCustomerId] = useState(null)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [addingNew, setAddingNew] = useState(false)
  const [done, setDone] = useState(false)

  if (!txn) {
    return (
      <div style={{ flex: 1, padding: 24 }}>
        <BackButton to="/inbox" />
        <p>Transaction not found.</p>
      </div>
    )
  }

  const canConfirm =
    type &&
    ((type === 'sale' && product.trim()) ||
      (type === 'expense' && category) ||
      (type === 'debt' && (customerId || newName.trim())))

  function confirm() {
    let cls = {
      type,
      productName: product || null,
      quantity: qty || null,
      category: category || null,
      customerId: customerId || null,
    }

    if (type === 'debt' && addingNew && newName.trim()) {
      const newCust = {
        id: newId('c'),
        name: newName.trim(),
        phone: newPhone.trim(),
        totalOwed: txn.direction === 'out' ? txn.amount : 0,
        payments: [],
      }
      addCustomer(newCust)
      cls.customerId = newCust.id
    } else if (type === 'debt' && customerId) {
      if (txn.direction === 'in') {
        // incoming cash = customer repaying their debt
        addDebtPayment(customerId, txn.amount, txn.id)
      } else {
        // outgoing = shop extends new credit to customer
        increaseDebt(customerId, txn.amount)
      }
    }

    classifyTransaction(txn.id, cls)
    setDone(true)
    setTimeout(() => navigate('/inbox'), 700)
  }

  if (done) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--green-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Icon name="check" size={32} color="var(--green)" />
        </div>
        <p style={{ fontSize: 16, fontWeight: 500 }}>Classified!</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Transaction saved
        </p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px' }}>
      <BackButton to="/inbox" />
      <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Classify</h1>

      <Card
        style={{
          textAlign: 'center',
          marginBottom: 16,
          background: txn.direction === 'in' ? 'var(--green-bg)' : 'var(--red-bg)',
          border: `1px solid ${txn.direction === 'in' ? 'var(--green-border)' : 'var(--red-border)'}`,
        }}
      >
        <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>
          {(txn.source === 'mpesa' ? 'M-Pesa' : 'Cash') + ' · ' + fmtTime(txn.ts)}
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: txn.direction === 'in' ? 'var(--green)' : 'var(--red)',
            margin: '2px 0',
          }}
        >
          {(txn.direction === 'in' ? '+' : '-') + fmtKES(txn.amount)}
        </p>
      </Card>

      <p
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '.05em',
          fontWeight: 500,
        }}
      >
        What is this?
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginBottom: 16,
        }}
      >
        {TYPE_OPTS.map((o) => (
          <div
            key={o.id}
            onClick={() => {
              setType(o.id)
              setCategory(null)
              setCustomerId(null)
              setAddingNew(false)
            }}
            style={{
              background: type === o.id ? o.bg : 'var(--bg-card)',
              border:
                type === o.id ? `2px solid ${o.color}` : '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 6px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon
              name={o.icon}
              size={22}
              color={type === o.id ? o.color : 'var(--text-secondary)'}
              style={{ display: 'block', margin: '0 auto 5px' }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: type === o.id ? o.color : 'var(--text-primary)',
              }}
            >
              {o.label}
            </span>
          </div>
        ))}
      </div>

      {type === 'sale' && (
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Product name
          </p>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. Johnnie Walker Black"
            style={inputStyle}
          />
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '10px 0 6px' }}>
            Quantity (optional)
          </p>
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="e.g. 2 bottles"
            style={inputStyle}
          />
        </div>
      )}

      {type === 'expense' && (
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Category
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EXPENSE_CATEGORIES.map((c) => (
              <div
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  background: category === c.id ? 'var(--blue-bg)' : 'var(--bg-card)',
                  border:
                    category === c.id
                      ? '2px solid var(--blue)'
                      : '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 10,
                  textAlign: 'center',
                  cursor: 'pointer',
                  gridColumn: c.id === 'other' ? '1 / -1' : 'auto',
                }}
              >
                <Icon
                  name={c.icon}
                  size={18}
                  color={category === c.id ? 'var(--blue)' : 'var(--text-secondary)'}
                  style={{ display: 'block', margin: '0 auto 3px' }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: category === c.id ? 'var(--blue-text)' : 'var(--text-primary)',
                  }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'debt' && (
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {txn.direction === 'in' ? 'Customer repaying debt' : 'Assign debt to customer'}
          </p>
          {customers.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setCustomerId(c.id)
                setAddingNew(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                background: customerId === c.id ? 'var(--blue-bg)' : 'var(--bg-card)',
                border:
                  customerId === c.id
                    ? '2px solid var(--blue)'
                    : '1px solid var(--border)',
                borderRadius: 10,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <Avatar name={c.name} color="blue" size={32} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</p>
                <p style={{ fontSize: 10, color: 'var(--amber)' }}>
                  {fmtKES(c.totalOwed)} owed
                </p>
              </div>
              {customerId === c.id && (
                <Icon name="circleCheck" size={18} color="var(--blue)" />
              )}
            </div>
          ))}
          <div
            onClick={() => {
              setAddingNew(!addingNew)
              setCustomerId(null)
            }}
            style={{
              border: '1px dashed var(--border-strong)',
              borderRadius: 10,
              padding: 10,
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Icon name="plus" size={14} /> New customer
          </div>
          {addingNew && (
            <div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Customer name"
                style={{ ...inputStyle, marginBottom: 8 }}
              />
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Phone (optional)"
                style={inputStyle}
              />
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Button
          variant={type === 'sale' ? 'primary' : type === 'expense' ? 'danger' : 'amber'}
          onClick={confirm}
          disabled={!canConfirm}
          icon="check"
        >
          {type ? `Confirm ${type}` : 'Select a type'}
        </Button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  border: '1px solid var(--border-strong)',
  borderRadius: 8,
  padding: '9px 11px',
  fontSize: 13,
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
}
