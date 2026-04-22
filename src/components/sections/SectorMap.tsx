import { useState } from 'react'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

type Sector = {
  id: string
  code: string
  label: string
  x: number           // percentage of viewBox
  y: number
  class: 'AMBER' | 'CYAN' | 'COLD'
  payload: string
  eta: string
}

const SECTORS: Sector[] = [
  { id: 's1', code: 'SEC-ARC-NA',   label: 'NORTH ATLANTIC GRID',    x: 24, y: 32, class: 'AMBER', payload: 'IND / ROBOTICS',   eta: 'T-08D' },
  { id: 's2', code: 'SEC-ARC-SA',   label: 'SOUTH SECTOR · SP-BR',   x: 33, y: 66, class: 'AMBER', payload: 'DESIGN OPS',       eta: 'LIVE'  },
  { id: 's3', code: 'SEC-ARC-EU',   label: 'EURO-CONTINENTAL BAND',  x: 52, y: 32, class: 'CYAN',  payload: 'SIGNAL / DEFENSE', eta: 'T-12H' },
  { id: 's4', code: 'SEC-ARC-MEA',  label: 'MEA CORRIDOR',           x: 58, y: 50, class: 'COLD',  payload: 'CLASSIFIED',       eta: '—'     },
  { id: 's5', code: 'SEC-ARC-APAC', label: 'APAC LONG-ARC',          x: 77, y: 48, class: 'CYAN',  payload: 'AI / LOGISTICS',   eta: 'T-04D' },
  { id: 's6', code: 'SEC-ARC-OCE',  label: 'SOUTH OCEANIC',          x: 85, y: 75, class: 'COLD',  payload: 'DORMANT',          eta: '—'     },
  { id: 's7', code: 'SEC-ARC-ARC',  label: 'ARCTIC LISTENING POST',  x: 50, y: 10, class: 'CYAN',  payload: 'LISTEN-ONLY',      eta: 'LIVE'  },
]

export function SectorMap() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 75, threshold: 0.08 })
  const rootRef = ref as React.RefObject<HTMLElement>
  useExitGlitch(rootRef, 'sectors')
  const [hover, setHover] = useState<Sector | null>(null)
  const [locked, setLocked] = useState<Sector | null>(null)
  const active = locked ?? hover ?? SECTORS[1]

  return (
    <section
      id="sectors"
      data-section
      ref={rootRef}
      style={{
        position: 'relative', background: '#000',
        padding: '80px 48px',
        display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 20,
      }}
    >
      <header data-entry style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', letterSpacing: '0.3em' }}>
            [ PHASE 07 / SECTOR GRID ]
          </div>
          <h2 data-glitch className="type-display" style={{ fontSize: 'clamp(42px, 5vw, 72px)', color: 'var(--text)', lineHeight: 0.9, marginTop: 8 }}>
            Deployment Map.
          </h2>
        </div>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.2em', textAlign: 'right' }}>
          <div>NODES ONLINE: <span style={{ color: 'var(--text)' }}>{SECTORS.length}</span></div>
          <div>CLICK TO LOCK</div>
        </div>
      </header>

      {/* Map */}
      <div data-entry style={{ position: 'relative', border: '1px solid var(--amber-border)', padding: 16, minHeight: 0 }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
        >
          {/* Lat/lon grid */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(v => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={100} stroke="rgba(255,101,0,0.08)" strokeWidth="0.1" />
              <line x1={0} y1={v} x2={100} y2={v} stroke="rgba(255,101,0,0.08)" strokeWidth="0.1" />
            </g>
          ))}

          {/* Equator */}
          <line x1={0} y1={50} x2={100} y2={50} stroke="rgba(255,101,0,0.3)" strokeWidth="0.15" strokeDasharray="1 1" />

          {/* Connection paths between active and others */}
          {SECTORS.map(s => (
            <line
              key={`ln-${s.id}`}
              x1={active.x} y1={active.y} x2={s.x} y2={s.y}
              stroke={s.id === active.id ? 'transparent' : 'rgba(255,101,0,0.18)'}
              strokeWidth="0.12"
            />
          ))}

          {/* Sectors */}
          {SECTORS.map(s => {
            const color = s.class === 'AMBER' ? '#FF6500' : s.class === 'CYAN' ? '#00D4FF' : '#555050'
            const isActive = active.id === s.id
            return (
              <g
                key={s.id}
                transform={`translate(${s.x}, ${s.y})`}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setLocked(locked?.id === s.id ? null : s)}
                style={{ cursor: 'crosshair' }}
              >
                {isActive && (
                  <>
                    <circle r={4.5} fill="none" stroke={color} strokeWidth="0.2" opacity={0.4} />
                    <circle r={3} fill="none" stroke={color} strokeWidth="0.2" opacity={0.65} />
                  </>
                )}
                <circle r={1.2} fill={color} />
                <circle r={0.45} fill="#000" />
                {/* Crosshair */}
                <line x1={-2} y1={0} x2={-0.9} y2={0} stroke={color} strokeWidth="0.13" />
                <line x1={0.9} y1={0} x2={2} y2={0} stroke={color} strokeWidth="0.13" />
                <line x1={0} y1={-2} x2={0} y2={-0.9} stroke={color} strokeWidth="0.13" />
                <line x1={0} y1={0.9} x2={0} y2={2} stroke={color} strokeWidth="0.13" />
                <text x={3} y={0.4} fontSize={1.4} fill={color} fontFamily="var(--font-mono)" letterSpacing="0.12em">
                  {s.code}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Corner crosshair markers */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 20, height: 20, borderTop: '1px solid var(--amber)', borderLeft: '1px solid var(--amber)' }} />
        <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderTop: '1px solid var(--amber)', borderRight: '1px solid var(--amber)' }} />
        <div style={{ position: 'absolute', bottom: 6, left: 6, width: 20, height: 20, borderBottom: '1px solid var(--amber)', borderLeft: '1px solid var(--amber)' }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 20, height: 20, borderBottom: '1px solid var(--amber)', borderRight: '1px solid var(--amber)' }} />
      </div>

      {/* Active sector info */}
      <div data-entry style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
        padding: '18px 22px',
        border: '1px solid var(--amber-border)',
        background: 'rgba(5,5,10,0.8)',
      }}>
        <InfoCol label="SECTOR" value={active.code} accent />
        <InfoCol label="LABEL" value={active.label} />
        <InfoCol label="PAYLOAD" value={active.payload} />
        <InfoCol label="ETA" value={active.eta} accent={active.eta === 'LIVE'} />
      </div>
    </section>
  )
}

function InfoCol({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="type-mono" style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.3em' }}>[ {label} ]</div>
      <div data-glitch className="type-display" style={{
        fontSize: 'clamp(18px, 2vw, 28px)',
        color: accent ? 'var(--amber)' : 'var(--text)',
        letterSpacing: '0.01em', marginTop: 6,
      }}>
        {value}
      </div>
    </div>
  )
}
