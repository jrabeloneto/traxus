import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * A single bright diagonal bar that sweeps across the viewport from
 * left-off-screen → right-off-screen, like a radar scan line.
 *
 * Repeats at random intervals. Hard-cut entry, linear sweep, hard-cut exit.
 */

interface Props {
  minInterval?: number
  maxInterval?: number
  sweepDuration?: number
  color?: string
}

export function ScanSweep({
  minInterval = 3500,
  maxInterval = 9000,
  sweepDuration = 0.32,
  color = 'rgba(255,101,0,0.18)',
}: Props) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    let timeout: ReturnType<typeof setTimeout>

    function trigger() {
      if (!bar) return
      // position off-screen left
      gsap.set(bar, { x: '-160vw', opacity: 1 })
      gsap.to(bar, {
        x: '160vw',
        duration: sweepDuration,
        ease: 'none', // linear — no ease
        onComplete: () => {
          gsap.set(bar, { opacity: 0 })
          timeout = setTimeout(trigger, Math.random() * (maxInterval - minInterval) + minInterval)
        },
      })
    }

    timeout = setTimeout(trigger, Math.random() * 2000 + 800)
    return () => {
      clearTimeout(timeout)
      gsap.killTweensOf(bar)
    }
  }, [minInterval, maxInterval, sweepDuration])

  return (
    <div
      aria-hidden
      ref={barRef}
      style={{
        position: 'fixed',
        top: '30%',
        left: 0,
        width: '40vw',
        height: '35vh',
        pointerEvents: 'none',
        zIndex: 801,
        opacity: 0,
        // thick diagonal bar: transparent → color → transparent
        background: `linear-gradient(
          105deg,
          transparent 0%,
          ${color} 45%,
          rgba(255,180,60,0.06) 50%,
          ${color} 55%,
          transparent 100%
        )`,
        filter: 'blur(1px)',
      }}
    />
  )
}
