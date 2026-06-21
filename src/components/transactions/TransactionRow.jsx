import Icon from '../ui/Icon'
import Badge from '../ui/Badge'
import { fmtKES, fmtTime } from '../../utils/formatters'

export default function TransactionRow({ txn, customers, onClick }) {
  const cls = txn.classification
  const isIn = txn.direction === 'in'
  const isMpesa = txn.source === 'mpesa'

  let iconBg = txn.classified ? (isIn ? '#e6f7f0' : '#fdeaea') : '#fef3dc'
  let iconFg = txn.classified ? (isIn ? '#1a9e6a' : '#d94040') : '#c47d0e'
  let iconName = isMpesa ? 'phone' : 'cash'

  let title = ''
  if (txn.classified && cls) {
    if (cls.type === 'sale') {
      title = 'Sale — ' + cls.productName
      iconName = 'bag'
    } else if (cls.type === 'expense') {
      title = 'Expense — ' + (cls.category || 'Other')
      iconName = 'receiptOff'
    } else if (cls.type === 'debt') {
      const cust = customers.find((c) => c.id === cls.customerId)
      title = 'Debt — ' + (cust ? cust.name : 'Customer')
      iconName = 'userDollar'
    }
  } else {
    title = (isMpesa ? 'M-Pesa' : 'Cash') + (isIn ? ' received' : ' paid out')
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        background: 'var(--bg-card)',
        borderRadius: 10,
        marginBottom: 6,
        border: txn.classified
          ? '1px solid var(--border)'
          : '1px solid var(--amber-border)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={iconName} size={15} color={iconFg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 2,
          }}
        >
          {fmtTime(txn.ts)}
          {!txn.classified && <Badge variant="warn">Classify →</Badge>}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: isIn ? 'var(--green)' : 'var(--red)',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {(isIn ? '+' : '-') + fmtKES(txn.amount)}
      </div>
    </div>
  )
}
