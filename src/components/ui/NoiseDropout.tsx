import { useEffect, useState } from 'react'

/**
 * Horizontal VHS-style static bars that randomly interrupt the screen.
 * Hard-cut on, hard-cut off. Each bar is a different shade of noise.
 *
 * Canvas-based for true per-pixel noise.
 */

interface Band {
  y: number      // 0-100 vh
  h: number      // height in vh
  opacity: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeBands(): Band[] {
  return Array.from({ length: randInt(2, 5) }, () => ({
    y: randInt(0, 88),
    h: randInt(1, 7),
    opacity: 0.08 + Math.random() * 0.18,
  }))
}

interface Props {
  minInterval?: number
  maxInterval?: number
  duration?: number
}

export function NoiseDropout({ minInterval = 2200, maxInterval = 7000, duration = 70 }: Props) {
  const [bands, setBands] = useState<Band[]>([])

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    function schedule() {
      const delay = randInt(minInterval, maxInterval)
      t = setTimeout(() => {
        setBands(makeBands())
        setTimeout(() => {
          setBands([])
          // occasional double-hit
          if (Math.random() > 0.6) {
            setTimeout(() => {
              setBands(makeBands())
              setTimeout(() => { setBands([]); schedule() }, duration)
            }, randInt(30, 80))
          } else {
            schedule()
          }
        }, duration)
      }, delay)
    }

    schedule()
    return () => clearTimeout(t)
  }, [minInterval, maxInterval, duration])

  if (!bands.length) return null

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 799, overflow: 'hidden' }}>
      {bands.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${b.y}vh`,
            height: `${b.h}vh`,
            // simulate noise with repeating micro-gradient
            background: `repeating-linear-gradient(
              90deg,
              rgba(255,101,0,${(b.opacity * 0.6).toFixed(3)}) 0px,
              rgba(0,0,0,${(b.opacity).toFixed(3)}) 1px,
              rgba(255,101,0,${(b.opacity * 0.3).toFixed(3)}) 2px,
              rgba(0,212,255,${(b.opacity * 0.15).toFixed(3)}) 3px,
              rgba(0,0,0,${(b.opacity * 0.8).toFixed(3)}) 4px,
              rgba(255,255,255,${(b.opacity * 0.05).toFixed(3)}) 5px
            )`,
          }}
        />
      ))}
    </div>
  )
}
