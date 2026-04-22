import { useEffect, useState } from 'react'

const LINES = [
  '> INITIALIZING TRAXUS RUNTIME...',
  '> HANDSHAKE: BRASS HANDS / SIGNAL OK',
  '> LOADING KERNEL MODULES ................ [DONE]',
  '> LINKING SENSOR MESH ................... [DONE]',
  '> MOUNTING FIELD OP: DELTA-412 .......... [DONE]',
  '> CLEARANCE VERIFIED',
  '> ENGAGING.',
]

interface Props {
  onComplete?: () => void
}

export function Boot({ onComplete }: Props) {
  const [shown, setShown] = useState<string[]>([])

  useEffect(() => {
    let idx = 0
    const id = setInterval(() => {
      setShown((prev) => [...prev, LINES[idx]])
      idx++
      if (idx >= LINES.length) {
        clearInterval(id)
        setTimeout(() => onComplete?.(), 500)
      }
    }, 220)
    return () => clearInterval(id)
  }, [onComplete])

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '80px 48px',
        position: 'relative',
      }}
    >
      <pre
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.7,
          color: 'var(--amber)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'pre',
          margin: 0,
        }}
      >
        {shown.join('\n')}
        {shown.length < LINES.length && <span className="blink">▌</span>}
      </pre>
    </section>
  )
}
