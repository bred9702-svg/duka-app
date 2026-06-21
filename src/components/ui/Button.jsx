import Icon from './Icon'

const VARIANTS = {
  primary: { background: 'var(--green)', color: '#fff' },
  danger: { background: 'var(--red)', color: '#fff' },
  amber: { background: 'var(--amber)', color: '#fff' },
  ghost: {
    background: 'var(--bg-page)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  icon,
  style = {},
}) {
  const base = {
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '11px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'opacity .15s',
    opacity: disabled ? 0.5 : 1,
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...(VARIANTS[variant] || VARIANTS.primary), ...style }}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  )
}
