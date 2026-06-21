import Card from '../components/ui/Card'

export default function SettingsScreen() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>Settings</h1>

      <Card style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Shop name</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>My Wines &amp; Spirits</p>
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Currency</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>KES — Kenyan Shilling</p>
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Version</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Duka v0.1 MVP</p>
      </Card>

      <p
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        Built for East African shop owners
      </p>
    </div>
  )
}
