import { useEffect, useRef, useState } from 'react'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

export function EndTransmission() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 90, threshold: 0.12 })
  const rootRef = ref as React.RefObject<HTMLElement>
  useExitGlitch(rootRef, 'end')

  const [dots, setDots] = useState('')
  const [countdown, setCountdown] = useState(99)
  const [secs, setSecs] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const id1 = setInterval(() => {
      setDots(d => (d.length >= 6 ? '' : d + '·'))
    }, 220)
    const id2 = setInterval(() => {
      setCountdown(c => (c <= 1 ? 99 : c - 1))
      setSecs(Math.floor((Date.now() - startRef.current) / 1000))
    }, 120)
    return () => { clearInterval(id1); clearInterval(id2) }
  }, [])

  return (
    <section
      id="end"
      data-section
      ref={rootRef}
      style={{
        position: 'relative', background: '#000',
        padding: '80px 48px',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gap: 20,
      }}
    >
      <header data-entry style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', letterSpacing: '0.3em' }}>
          [ PHASE 10 / END TRANSMISSION ]
        </div>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.22em' }}>
          SIGNOFF · AUTO-PURGE IN <span style={{ color: 'var(--amber)' }}>{countdown.toString().padStart(2, '0')}</span>
        </div>
      </header>

      {/* Giant centered signoff */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', gap: 16,
      }}>
        <div data-entry data-glitch className="type-display" style={{
          fontSize: 'clamp(80px, 14vw, 220px)',
          color: 'var(--amber)', lineHeight: 0.85, letterSpacing: '-0.025em',
        }}>
          END OF<br/>LINE.
        </div>
        <div data-entry className="type-mono" style={{
          fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.32em', marginTop: 18,
        }}>
          UPLINK CLOSED{dots}
        </div>
        <div data-entry className="type-mono" style={{
          fontSize: 11, color: 'var(--text)', letterSpacing: '0.22em', marginTop: 32, maxWidth: 640,
        }}>
          YOU HAVE REACHED THE EDGE OF THE BRIEFING.<br/>
          WHAT FOLLOWS IS FOR CLEARED PERSONNEL ONLY.
        </div>

        <div data-entry style={{ marginTop: 40, display: 'flex', gap: 20 }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="chamfer type-mono"
            style={{
              background: 'var(--amber)', color: '#000',
              border: 'none', padding: '14px 32px',
              fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
              cursor: 'crosshair', fontFamily: 'inherit',
            }}
          >
            RESTART BRIEFING ▸
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView()}
            className="type-mono"
            style={{
              background: 'transparent', color: 'var(--amber)',
              border: '1px solid var(--amber-border)', padding: '14px 32px',
              fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
              cursor: 'crosshair', fontFamily: 'inherit',
            }}
          >
            ENGAGE CONTACT ▸
          </button>
        </div>
      </div>

      {/* Credits rail */}
      <footer data-entry className="type-mono" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.22em',
        paddingTop: 24, borderTop: '1px solid rgba(255,101,0,0.15)',
      }}>
        <Credit label="BROADCAST" value="TRAXUS // DESIGN OPS" />
        <Credit label="SIGNAL" value="ARC · SPECTER ONE" />
        <Credit label="SESSION" value={`${secs.toString().padStart(3, '0')}s`} />
        <Credit label="CLEARANCE" value="DELTA-412" />
      </footer>
    </section>
  )
}

function Credit({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: 'var(--text-dim)' }}>▸ {label}</div>
      <div style={{ color: 'var(--text)', marginTop: 4 }}>{value}</div>
    </div>
  )
}
