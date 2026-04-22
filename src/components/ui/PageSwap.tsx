import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Short fullscreen "LOADING NEXT PHASE…" slab.
 * Fires on `traxus:page-swap` CustomEvent with detail: { id, label, index }.
 *
 * Shows for ~380ms with mono bars + progress ticks, then gone.
 * Purely decorative — overlays the page mid-transition.
 */

export type PageSwapDetail = {
  id: string
  label: string
  index: number
}

export function PageSwap() {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const tickRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onSwap(ev: Event) {
      const e = ev as CustomEvent<PageSwapDetail>
      const { id, label, index } = e.detail
      const root = rootRef.current
      const bar = barRef.current
      const lbl = labelRef.current
      const code = codeRef.current
      const tick = tickRef.current
      if (!root || !bar || !lbl || !code || !tick) return

      gsap.set(root, { opacity: 0 })
      gsap.set([bar, lbl, code, tick], { opacity: 0 })
      lbl.textContent = `LOADING · ${label}`
      code.textContent = `SEEK ${id.toUpperCase()} · PHASE ${index.toString().padStart(2, '0')}`

      const tl = gsap.timeline()
      // Appear
      tl.set(root, { opacity: 1 }, 0)
      tl.set(bar, { opacity: 1, scaleX: 0, transformOrigin: '0% 50%' }, 0)
      tl.set(lbl, { opacity: 1 }, 0.02)
      tl.set(code, { opacity: 1 }, 0.06)
      tl.set(tick, { opacity: 1 }, 0.08)
      // Progress bar fills in 3 step-jumps (no ease — pure snap)
      tl.set(bar, { scaleX: 0.33 }, 0.1)
      tl.set(bar, { scaleX: 0.66 }, 0.2)
      tl.set(bar, { scaleX: 1 }, 0.3)
      // Clear
      tl.set([bar, lbl, code, tick], { opacity: 0 }, 0.36)
      tl.set(root, { opacity: 0 }, 0.38)
    }

    window.addEventListener('traxus:page-swap', onSwap as EventListener)
    return () => window.removeEventListener('traxus:page-swap', onSwap as EventListener)
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 9997,
        pointerEvents: 'none', opacity: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{
        width: 'min(620px, 70vw)',
        display: 'flex', flexDirection: 'column', gap: 16,
        padding: '28px 32px',
        border: '1px solid var(--amber)',
        background: '#000',
        boxShadow: '0 0 80px rgba(255,101,0,0.25)',
      }}>
        <div ref={codeRef} className="type-mono" style={{
          fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.3em',
        }}>
          SEEK · PHASE 00
        </div>
        <div ref={labelRef} className="type-display" style={{
          fontSize: 'clamp(28px, 3.6vw, 52px)',
          color: 'var(--amber)', lineHeight: 0.95, letterSpacing: '-0.01em',
        }}>
          LOADING · PHASE
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative', height: 4, background: 'rgba(255,101,0,0.12)', marginTop: 8 }}>
          <div ref={barRef} style={{
            position: 'absolute', inset: 0, background: 'var(--amber)', transform: 'scaleX(0)',
          }} />
        </div>

        {/* Ticks */}
        <div ref={tickRef} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: '0.3em' }}>
          <span>00%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>
    </div>
  )
}
