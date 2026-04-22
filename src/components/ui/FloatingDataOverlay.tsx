import { useEffect, useState } from 'react'
import { createDataPoints, generateDataPoint, type DataPoint } from '../../utils/dataGibberish'

interface Props {
  /** number of data fragments on screen */
  count?: number
  /** ms between flicker updates */
  flickerInterval?: number
}

/**
 * HTML overlay of pseudo-random HUD fragments in monospace amber.
 * - No transitions — everything is a hard cut (teleport).
 * - Some points flicker to new positions; some blink opacity to 0.
 * - Some carry black rectangles behind them for that "corruption" look.
 */
export function FloatingDataOverlay({ count = 38, flickerInterval = 220 }: Props) {
  const [points, setPoints] = useState<DataPoint[]>(() => createDataPoints(count))

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) =>
        prev.map((p) => {
          const r = Math.random()
          if (r > 0.9) {
            // fully teleport + regenerate text
            return {
              ...p,
              text: generateDataPoint(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0.4 + Math.random() * 0.6,
            }
          }
          if (r > 0.82) {
            // blink off briefly
            return { ...p, opacity: 0 }
          }
          if (r > 0.7 && p.opacity < 0.1) {
            // blink back on
            return { ...p, opacity: 0.4 + Math.random() * 0.6 }
          }
          return p
        }),
      )
    }, flickerInterval)
    return () => clearInterval(id)
  }, [flickerInterval])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 30,
        overflow: 'hidden',
      }}
    >
      {points.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontFamily: 'var(--font-mono)',
            fontSize: `${p.size}px`,
            color: 'var(--amber)',
            opacity: p.opacity,
            background: p.hasBlock ? 'rgba(0,0,0,0.85)' : 'none',
            padding: p.hasBlock ? '1px 3px' : 0,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transform: 'translate(-50%, -50%)',
            transition: 'none',
            mixBlendMode: p.hasBlock ? 'normal' : 'screen',
            textShadow: p.hasBlock ? 'none' : '0 0 6px rgba(255,101,0,0.25)',
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  )
}
