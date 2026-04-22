import { useEffect, useRef, useState } from 'react'

/**
 * Hidden clearance unlock.
 *
 * Type the sequence "TRAXUS" anywhere outside an input → fullscreen
 * "CLEARANCE GRANTED" override flash with scrambled classified strings.
 * Auto-dismisses after 3.4s or on any key. Dev easter egg / theme flourish.
 */

const SEQUENCE = 'TRAXUS'

const CLASSIFIED_LINES = [
  '//CLEARANCE: OMEGA-7 ROLLING',
  '//OBJECT: SPECTER-ONE — ACTIVE',
  '//CHANNEL: 0xA3F1 / OPEN',
  '//INSTRUCTION: BRASS HANDS HOLD THE LINE',
  '//STATUS: ALL WORK IS OUR OWN',
  '//NEXT DEPLOYMENT: SECTOR 0 / 00:00:00',
]

function scramble(s: string): string {
  const chars = '█▓▒░#@%&*=+-<>?!§Ω'
  return s.split('').map(c => c === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0]).join('')
}

export function ClearanceOverride() {
  const [active, setActive] = useState(false)
  const [lines, setLines] = useState<string[]>([])
  const bufferRef = useRef('')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't interfere with text inputs
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (active) { trigger(false); return }

      const key = e.key.toUpperCase()
      if (key.length !== 1) { bufferRef.current = ''; return }
      bufferRef.current = (bufferRef.current + key).slice(-SEQUENCE.length)
      if (bufferRef.current === SEQUENCE) {
        bufferRef.current = ''
        trigger(true)
      }
    }

    function trigger(on: boolean) {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      if (!on) { setActive(false); setLines([]); return }
      setActive(true)
      // Staggered line reveal with scramble → resolve
      CLASSIFIED_LINES.forEach((finalLine, i) => {
        const appear = window.setTimeout(() => {
          setLines(prev => [...prev, scramble(finalLine)])
          let passes = 0
          const scr = window.setInterval(() => {
            passes++
            setLines(prev => {
              const next = [...prev]
              next[i] = passes >= 4 ? finalLine : scramble(finalLine)
              return next
            })
            if (passes >= 4) clearInterval(scr)
          }, 55)
          timersRef.current.push(scr as unknown as number)
        }, 180 + i * 220)
        timersRef.current.push(appear)
      })
      const dismiss = window.setTimeout(() => trigger(false), 3400)
      timersRef.current.push(dismiss)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      timersRef.current.forEach(clearTimeout)
    }
  }, [active])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        pointerEvents: 'none',
      }}
    >
      {/* Scanlines overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,101,0,0.04) 0, rgba(255,101,0,0.04) 1px, transparent 1px, transparent 3px)',
        mixBlendMode: 'screen',
      }} />

      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 'clamp(48px, 8vw, 128px)',
        color: 'var(--amber)',
        letterSpacing: '0.08em',
        lineHeight: 1,
        marginBottom: 28,
        textAlign: 'center',
      }}>
        CLEARANCE<br />GRANTED
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.22em',
        color: 'var(--text)',
        textAlign: 'left',
        minWidth: 'min(640px, 80vw)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: i % 2 === 0 ? 'var(--amber)' : 'var(--text-dim)' }}>
            {l}
          </div>
        ))}
        <div className="blink" style={{ color: 'var(--amber)', marginTop: 10 }}>▌ AWAITING DIRECTIVE</div>
      </div>

      <div style={{
        position: 'absolute',
        top: 28, left: 32,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.28em',
        color: 'var(--amber)',
      }}>
        // OVERRIDE · OMEGA-7
      </div>
      <div style={{
        position: 'absolute',
        bottom: 28, right: 32,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.28em',
        color: 'var(--text-dim)',
      }}>
        PRESS ANY KEY TO DISMISS
      </div>
    </div>
  )
}
