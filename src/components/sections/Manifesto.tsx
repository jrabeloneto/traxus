import { useRef } from 'react'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

const LINES = [
  { kind: 'stamp', text: '[ MANIFEST — UNCLASSIFIED ]' },
  { kind: 'small', text: 'WE DO NOT DECORATE,' },
  { kind: 'big',   text: 'WE DEPLOY.' },
  { kind: 'small', text: 'WE DO NOT ITERATE,' },
  { kind: 'big',   text: 'WE CONSTRUCT.' },
  { kind: 'small', text: 'WE DO NOT PITCH,' },
  { kind: 'big',   text: 'WE DELIVER.' },
  { kind: 'stamp', text: '— END OF TRANSMISSION —' },
]

export function Manifesto() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 110, threshold: 0.1 })
  const rootRef = ref as React.RefObject<HTMLElement>
  useExitGlitch(rootRef, 'manifesto')
  const gridRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="manifesto"
      data-section
      ref={rootRef}
      style={{
        position: 'relative', background: '#000',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '0 clamp(32px, 6vw, 96px)',
        overflow: 'hidden',
      }}
    >
      <div
        ref={gridRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,101,0,0.06) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,101,0,0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Corner markers */}
      <div data-entry style={{ position: 'absolute', top: 40, left: 40, width: 56, height: 56, borderTop: '2px solid var(--amber)', borderLeft: '2px solid var(--amber)' }} />
      <div data-entry style={{ position: 'absolute', top: 40, right: 40, width: 56, height: 56, borderTop: '2px solid var(--amber)', borderRight: '2px solid var(--amber)' }} />
      <div data-entry style={{ position: 'absolute', bottom: 40, left: 40, width: 56, height: 56, borderBottom: '2px solid var(--amber)', borderLeft: '2px solid var(--amber)' }} />
      <div data-entry style={{ position: 'absolute', bottom: 40, right: 40, width: 56, height: 56, borderBottom: '2px solid var(--amber)', borderRight: '2px solid var(--amber)' }} />

      {/* Lines */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1200 }}>
        {LINES.map((line, i) => {
          if (line.kind === 'stamp') {
            return (
              <div
                key={i}
                data-entry
                className="type-mono"
                style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.32em', marginBottom: 24 }}
              >
                {line.text}
              </div>
            )
          }
          if (line.kind === 'small') {
            return (
              <div
                key={i}
                data-entry
                data-glitch
                className="type-display"
                style={{ fontSize: 'clamp(18px, 2.2vw, 32px)', color: 'var(--text-dim)', lineHeight: 1.1, marginTop: 22 }}
              >
                {line.text}
              </div>
            )
          }
          return (
            <div
              key={i}
              data-entry
              data-glitch
              className="type-display"
              style={{
                fontSize: 'clamp(56px, 11vw, 180px)',
                color: i === 5 ? 'var(--amber)' : 'var(--text)',
                lineHeight: 0.88,
                letterSpacing: '-0.025em',
                marginBottom: 4,
              }}
            >
              {line.text}
            </div>
          )
        })}
      </div>

      {/* Side rail */}
      <div style={{
        position: 'absolute', top: '50%', right: 40, transform: 'translateY(-50%)',
        writingMode: 'vertical-rl', textOrientation: 'mixed',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
        color: 'var(--text-dim)',
      }}>
        DOCTRINE · CLASS 01 · REV. Δ · NON-NEGOTIABLE
      </div>
    </section>
  )
}
