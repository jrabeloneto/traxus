import { useEffect, useState } from 'react'

function formatTimestamp(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}-${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`
}

export function StatusBar() {
  const [ts, setTs] = useState(() => formatTimestamp(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTs(formatTimestamp(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 24,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        borderBottom: '1px solid var(--amber-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
        gap: 18,
      }}
    >
      <span style={{ color: 'var(--text)' }}>
        TRAXUS <span className="blink" style={{ color: 'var(--amber)' }}>■</span>
      </span>
      <Divider />
      <span>SYSTEM: <span style={{ color: 'var(--text)' }}>ACTIVE</span></span>
      <Divider />
      <span>FIELD OP: <span style={{ color: 'var(--text)' }}>ONLINE</span></span>
      <Divider />
      <span>SECTOR: <span style={{ color: 'var(--text)' }}>DEPLOYED</span></span>
      <div style={{ flex: 1 }} />
      <span style={{ color: 'var(--text-dim)' }}>UTC</span>
      <span style={{ color: 'var(--text)' }}>{ts}</span>
      <Divider />
      <span>
        CLEARANCE: <span style={{ color: 'var(--amber-hot)' }}>DELTA-412</span>
      </span>
    </div>
  )
}

function Divider() {
  return (
    <span style={{ color: 'var(--amber-border)', fontSize: 9 }}>│</span>
  )
}
