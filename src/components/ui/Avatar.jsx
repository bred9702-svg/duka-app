import { initials } from '../../utils/formatters'

const COLOR_MAP = {
  blue: { bg: '#dbeafe', fg: '#1e40af' },
  green: { bg: '#dcfce7', fg: '#166534' },
  amber: { bg: '#fef3c7', fg: '#92400e' },
  red: { bg: '#fee2e2', fg: '#991b1b' },
  purple: { bg: '#ede9fe', fg: '#5b21b6' },
}

export default function Avatar({ name, color = 'blue', size = 36 }) {
  const { bg, fg } = COLOR_MAP[color] || COLOR_MAP.blue
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}
