import { useEffect, useRef, useState } from 'react'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

type Entry = {
  time: string
  level: 'INFO' | 'WARN' | 'CRIT' | 'SIG'
  code: string
  msg: string
}

const POOL: Omit<Entry, 'time'>[] = [
  { level: 'SIG',  code: 'SIG-0412', msg: 'SIGNAL LOCK · OBJECT ARC-IND-CORE · RANGE NOMINAL' },
  { level: 'INFO', code: 'OPS-7001', msg: 'HANDSHAKE COMPLETE · CLEARANCE DELTA-412 · OK' },
  { level: 'INFO', code: 'OPS-7204', msg: 'RENDERING MANIFEST · 1920 POINTS · 24 CURVES' },
  { level: 'WARN', code: 'WRN-2301', msg: 'INTERFERENCE · SECTOR MEA · DROPPED PACKET 0.02%' },
  { level: 'INFO', code: 'OPS-8010', msg: 'FRAME-TIME 16.6ms · GL CONTEXT: HEALTHY' },
  { level: 'CRIT', code: 'ERR-9120', msg: 'UNAUTHORIZED PING · BLOCKED AT EDGE · LOG ARCHIVED' },
  { level: 'SIG',  code: 'SIG-0418', msg: 'NEW PAYLOAD QUEUED · DESIGN / INDUSTRIAL' },
  { level: 'INFO', code: 'OPS-7433', msg: 'TELEMETRY STREAM OPEN · 48ms AVG LATENCY' },
  { level: 'WARN', code: 'WRN-2466', msg: 'PARALLAX DRIFT · +0.18 · WITHIN TOLERANCE' },
  { level: 'INFO', code: 'OPS-7521', msg: 'GLITCH EVENT · CHANCE 0.003 · EXPECTED' },
  { level: 'SIG',  code: 'SIG-0502', msg: 'IDENTITY FLASH CYCLE · 19 FRAMES · LOOPED' },
  { level: 'INFO', code: 'OPS-8112', msg: 'CURSOR: CROSSHAIR · BORDER-RADIUS: 0 · OK' },
  { level: 'CRIT', code: 'ERR-9304', msg: 'INBOUND PROBE · ORIGIN CLASSIFIED · CONTAINED' },
  { level: 'INFO', code: 'OPS-8800', msg: 'CHAPTER MARKER FIRED · PHASE 03 · OK' },
  { level: 'WARN', code: 'WRN-2701', msg: 'SCANLINE OPACITY NUDGED · 0.06 → 0.07 · RESET' },
]

function fmtTime(d: Date) {
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  const ms = d.getMilliseconds().toString().padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export function MissionLog() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 60, threshold: 0.1 })
  const rootRef = ref as React.RefObject<HTMLElement>
  useExitGlitch(rootRef, 'log')

  const [entries, setEntries] = useState<Entry[]>([])
  const [paused, setPaused] = useState(false)
  const bufRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    // Seed initial entries
    const seed: Entry[] = Array.from({ length: 8 }, () => {
      const p = POOL[Math.floor(Math.random() * POOL.length)]
      return { ...p, time: fmtTime(new Date(Date.now() - Math.random() * 60000)) }
    })
    setEntries(seed)

    let id = 0
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !id) {
          id = window.setInterval(() => {
            if (paused) return
            const p = POOL[Math.floor(Math.random() * POOL.length)]
            const entry: Entry = { ...p, time: fmtTime(new Date()) }
            setEntries(prev => [...prev.slice(-80), entry])
          }, 600 + Math.random() * 900)
        } else if (!e.isIntersecting && id) {
          clearInterval(id); id = 0
        }
      })
    }, { threshold: 0.3 })
    obs.observe(el)

    return () => { obs.disconnect(); if (id) clearInterval(id) }
  }, [rootRef, paused])

  useEffect(() => {
    const el = bufRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  return (
    <section
      id="log"
      data-section
      ref={rootRef}
      style={{
        position: 'relative', background: '#000',
        padding: '80px 48px',
        display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 18,
      }}
    >
      <header data-entry style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', letterSpacing: '0.3em' }}>
            [ PHASE 08 / MISSION LOG ]
          </div>
          <h2 data-glitch className="type-display" style={{ fontSize: 'clamp(42px, 5vw, 72px)', color: 'var(--text)', lineHeight: 0.9, marginTop: 8 }}>
            Live Telemetry.
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <div className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
            STREAM: <span style={{ color: paused ? '#FF4040' : 'var(--amber)' }}>{paused ? 'PAUSED' : 'LIVE'}</span>
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            className="type-mono"
            style={{
              background: 'transparent', border: '1px solid var(--amber-border)',
              color: 'var(--amber)', padding: '6px 14px',
              fontFamily: 'inherit', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', cursor: 'crosshair',
            }}
          >
            {paused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </header>

      <div
        data-entry
        data-scroll-lock
        ref={bufRef}
        style={{
          border: '1px solid var(--amber-border)',
          background: 'rgba(5,5,10,0.8)',
          padding: '14px 18px',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.7,
          letterSpacing: '0.04em',
          boxShadow: 'inset 0 0 80px rgba(255,101,0,0.04)',
        }}
      >
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 70px 120px 1fr', gap: 16 }}>
            <span style={{ color: 'var(--text-dim)' }}>{e.time}</span>
            <span style={{
              color:
                e.level === 'CRIT' ? '#FF4040' :
                e.level === 'WARN' ? 'var(--amber-hot)' :
                e.level === 'SIG'  ? 'var(--cyan)' :
                'var(--text)',
            }}>
              [{e.level}]
            </span>
            <span style={{ color: 'var(--text-dim)' }}>{e.code}</span>
            <span style={{ color: e.level === 'CRIT' ? '#FF6060' : 'var(--text)' }}>{e.msg}</span>
          </div>
        ))}
      </div>

      <footer data-entry className="type-mono" style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.22em',
      }}>
        <span>BUFFER: {entries.length} / 80</span>
        <span>RETENTION: 24H · ARCHIVE: ENCRYPTED</span>
        <span>CHANNEL: ARC.SPECTER.ONE</span>
      </footer>
    </section>
  )
}
