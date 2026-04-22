import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Fullscreen phase number flash.
 *
 * Listens on the `window` for a `traxus:chapter` CustomEvent with
 *   detail: { index: number, label: string, tone: 'amber' | 'cyan' | 'white' }
 *
 * and snap-animates a full-bleed overlay showing the phase index + label.
 * Pure step animation — no eases, no fades. 4 hard-cut frames:
 *   frame 0: nothing
 *   frame 1: phase number + grid
 *   frame 2: number shifts, label appears, crosshair
 *   frame 3: gone
 */

export type ChapterDetail = {
  index: number
  label: string
  tone?: 'amber' | 'cyan' | 'white'
}

export function ChapterMarker() {
  const rootRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const crossRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const bracketTLRef = useRef<HTMLDivElement>(null)
  const bracketBRRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onChapter(ev: Event) {
      const e = ev as CustomEvent<ChapterDetail>
      const { index, label, tone = 'amber' } = e.detail
      const root = rootRef.current
      const num = numberRef.current
      const lbl = labelRef.current
      const cross = crossRef.current
      const grid = gridRef.current
      const btl = bracketTLRef.current
      const bbr = bracketBRRef.current
      const code = codeRef.current
      if (!root || !num || !lbl || !cross || !grid || !btl || !bbr || !code) return

      const color = tone === 'cyan' ? '#00D4FF' : tone === 'white' ? '#F5F0E8' : '#FF6500'

      // Reset
      gsap.set(root, { opacity: 0 })
      gsap.set([num, lbl, cross, grid, btl, bbr, code], { opacity: 0 })

      const tl = gsap.timeline()

      // Frame 1: grid + number snap
      tl.set(root, { opacity: 1 }, 0)
      tl.set(grid, { opacity: 1 }, 0)
      tl.set(num, { opacity: 1, x: 0, color, textContent: formatIndex(index) }, 0)
      tl.set(btl, { opacity: 1, borderColor: color }, 0)
      tl.set(code, { opacity: 1, color: '#555050', textContent: `CHAPTER ${formatIndex(index)} // SEQ-${Date.now().toString().slice(-5)}` }, 0)

      // Frame 2 (~40ms later): number offsets, label + crosshair
      tl.set(num, { x: -40 }, 0.04)
      tl.set(lbl, { opacity: 1, color, textContent: label }, 0.04)
      tl.set(cross, { opacity: 1, borderColor: color }, 0.04)
      tl.set(bbr, { opacity: 1, borderColor: color }, 0.04)

      // Frame 3 (~100ms): everything gone
      tl.set([num, lbl, cross, grid, btl, bbr, code], { opacity: 0 }, 0.1)
      tl.set(root, { opacity: 0 }, 0.11)
    }

    window.addEventListener('traxus:chapter', onChapter as EventListener)
    return () => window.removeEventListener('traxus:chapter', onChapter as EventListener)
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        opacity: 0,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.92)',
      }}
    >
      {/* Grid backdrop */}
      <div
        ref={gridRef}
        style={{
          position: 'absolute', inset: 0, opacity: 0,
          backgroundImage:
            'linear-gradient(rgba(255,101,0,0.08) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,101,0,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top-left bracket */}
      <div
        ref={bracketTLRef}
        style={{
          position: 'absolute', top: 40, left: 40, width: 70, height: 70,
          borderTop: '2px solid #FF6500', borderLeft: '2px solid #FF6500',
          opacity: 0,
        }}
      />

      {/* Bottom-right bracket */}
      <div
        ref={bracketBRRef}
        style={{
          position: 'absolute', bottom: 40, right: 40, width: 70, height: 70,
          borderBottom: '2px solid #FF6500', borderRight: '2px solid #FF6500',
          opacity: 0,
        }}
      />

      {/* Massive phase number */}
      <div
        ref={numberRef}
        className="type-display"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(180px, 30vw, 460px)',
          color: '#FF6500',
          lineHeight: 0.85,
          opacity: 0,
          letterSpacing: '-0.04em',
        }}
      >
        00
      </div>

      {/* Crosshair */}
      <div
        ref={crossRef}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 180, height: 180,
          border: '1px solid #FF6500',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: -20, right: -20, height: 1, background: 'currentColor', opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: '50%', top: -20, bottom: -20, width: 1, background: 'currentColor', opacity: 0.45 }} />
      </div>

      {/* Section label under number */}
      <div
        ref={labelRef}
        className="type-mono"
        style={{
          position: 'absolute',
          top: 'calc(50% + 200px)', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          color: '#FF6500',
          letterSpacing: '0.3em',
          opacity: 0,
          whiteSpace: 'nowrap',
        }}
      >
        PHASE LABEL
      </div>

      {/* Code tag top-right */}
      <div
        ref={codeRef}
        className="type-mono"
        style={{
          position: 'absolute', top: 48, right: 130,
          fontSize: 10, color: '#555050',
          letterSpacing: '0.2em', opacity: 0,
        }}
      >
        CHAPTER 00 // SEQ-00000
      </div>
    </div>
  )
}

function formatIndex(n: number) {
  return n.toString().padStart(2, '0')
}

export function fireChapter(detail: ChapterDetail) {
  window.dispatchEvent(new CustomEvent('traxus:chapter', { detail }))
}
