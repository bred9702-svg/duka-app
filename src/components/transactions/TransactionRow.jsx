import Icon from '../ui/Icon'
import Badge from '../ui/Badge'
import { fmtKES, fmtTime } from '../../utils/formatters'

export default function TransactionRow({ txn, customers, onClick, delay = 0 }) {
  const cls = txn.classification || txn
  const isIn = txn.direction === 'in'
  const isMpesa = txn.source === 'mpesa'
  const isClassified = txn.classified

  // Détermine le type depuis les deux formats possibles
  // (ancien format local: txn.classification.type, nouveau: txn.operation_type)
  const opType = txn.operation_type || txn.classification?.type || null

  let iconBg = isIn ? 'rgba(95,217,122,0.18)' : 'rgba(255,107,91,0.18)'
  let iconFg = isIn ? '#5FD97A' : '#FF6B5B'
  let iconName = isMpesa ? 'phone' : 'cash'
  let title = ''

  if (isClassified && opType) {
    if (opType === 'sale') {
      // Nom du produit depuis le join Supabase ou l'ancien format
      const productName = txn.product?.name || txn.classification?.productName || 'Product'
      title = 'Sale — ' + productName
      iconName = 'bottle'
      iconBg = 'rgba(240,169,61,0.18)'
      iconFg = '#F0A93D'
    } else if (opType === 'expense') {
      const cat = txn.expense_category || txn.classification?.category || 'Other'
      title = 'Expense — ' + cat
      iconName = 'receiptOff'
      iconBg = 'rgba(255,107,91,0.18)'
      iconFg = '#FF6B5B'
    } else if (opType === 'debt') {
      // Nom du client depuis le join Supabase ou les customers locaux
      const custName =
        txn.customer?.name ||
        customers?.find(c => c.id === txn.customer_id)?.name ||
        customers?.find(c => c.id === txn.classification?.customerId)?.name ||
        'Customer'
      title = 'Debt — ' + custName
      iconName = 'userDollar'
      iconBg = 'rgba(91,159,240,0.18)'
      iconFg = '#5B9FF0'
    }
  } else {
    // Non classifiée — affiche le bon label selon direction
    if (isMpesa) {
      title = isIn ? 'M-Pesa received' : 'M-Pesa sent'
    } else {
      title = isIn ? 'Cash received' : 'Cash paid out'
    }
  }

  // Timestamp — supporte les deux formats
  const timestamp = txn.created_at || txn.ts

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 11px',
        background: isClassified ? 'var(--glass-fill-soft)' : 'rgba(240,169,61,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isClassified
          ? '1px solid var(--glass-border)'
          : '1px solid rgba(240,169,61,0.45)',
        borderRadius: 12,
        marginBottom: 7,
        cursor: onClick ? 'pointer' : 'default',
        animation: 'slideUp 0.4s ease-out backwards',
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={15} color={iconFg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 500,
          color: 'var(--text-hi)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 9, color: 'var(--text-low)',
          display: 'flex', alignItems: 'center', gap: 5, marginTop: 2,
        }}>
          {fmtTime(timestamp)}
          {!isClassified && <Badge variant="warn">Classify →</Badge>}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13, fontWeight: 700,
        color: isIn ? '#5FD97A' : '#FF6B5B',
        textAlign: 'right', flexShrink: 0,
      }}>
        {(isIn ? '+' : '-') + fmtKES(txn.amount)}
      </div>
    </div>
  )
}
