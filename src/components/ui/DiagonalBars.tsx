import { useEffect, useState } from 'react'

/**
 * Periodic diagonal stripe overlays — VHS tracking artifact / industrial radar.
 * Hard-cut appearance (no ease), random intervals.
 *
 * Two flavours:
 *   mode "stripes"  — full-screen repeating diagonal lines
 *   mode "bars"     — 3-6 thick angular bars stacked vertically
 */

interface DiagonalBarsProps {
  minInterval?: number // ms
  maxInterval?: number // ms
  duration?: number    // ms — how long each flash lasts
}

interface BarState {
  active: boolean
  mode: 'stripes' | 'bars'
  angle: number
  color: string
  bars: { top: number; height: number; opacity: number }[]
}

const COLORS = [
  'rgba(255,101,0,',   // amber
  'rgba(0,212,255,',   // cyan
  'rgba(255,255,255,', // white (inversion flash)
]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildBars() {
  const count = randInt(3, 7)
  return Array.from({ length: count }, () => ({
    top: randInt(0, 90),
    height: randInt(1, 12),
    opacity: 0.06 + Math.random() * 0.18,
  }))
}

export function DiagonalBars({ minInterval = 1800, maxInterval = 5000, duration = 90 }: DiagonalBarsProps) {
  const [state, setState] = useState<BarState>({
    active: false,
    mode: 'bars',
    angle: -45,
    color: COLORS[0],
    bars: [],
  })

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function schedule() {
      const delay = randInt(minInterval, maxInterval)
      timeout = setTimeout(() => {
        const mode = Math.random() > 0.45 ? 'bars' : 'stripes'
        const color = COLORS[Math.floor(Math.random() * COLORS.length)]
        const angle = Math.random() > 0.5 ? -45 + randInt(-12, 12) : -60 + randInt(-8, 8)
        setState({ active: true, mode, angle, color, bars: buildBars() })

        // flash off
        setTimeout(() => {
          setState(s => ({ ...s, active: false }))
          // occasionally double-flash
          if (Math.random() > 0.65) {
            setTimeout(() => {
              setState(s => ({ ...s, active: true, bars: buildBars() }))
              setTimeout(() => setState(s => ({ ...s, active: false })), duration)
            }, duration + randInt(20, 60))
          }
          schedule()
        }, duration)
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeout)
  }, [minInterval, maxInterval, duration])

  if (!state.active) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 800,
        overflow: 'hidden',
      }}
    >
      {state.mode === 'stripes' ? (
        /* Full-screen diagonal repeating stripes */
        <div
          style={{
            position: 'absolute',
            inset: '-100%',
            background: `repeating-linear-gradient(
              ${state.angle}deg,
              ${state.color}0.06) 0px,
              ${state.color}0.06) 1px,
              transparent 1px,
              transparent 14px
            )`,
          }}
        />
      ) : (
        /* Stacked diagonal bars */
        state.bars.map((bar, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '-20%',
              right: '-20%',
              top: `${bar.top}%`,
              height: `${bar.height}px`,
              background: `${state.color}${bar.opacity.toFixed(2)})`,
              transform: `rotate(${state.angle + randInt(-3, 3)}deg)`,
              transformOrigin: 'center',
            }}
          />
        ))
      )}
    </div>
  )
}
