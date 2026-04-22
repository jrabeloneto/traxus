import { useRef } from 'react'
import { Scene } from '../canvas/Scene'
import { Model } from '../canvas/Model'
import { Lights } from '../canvas/Lights'
import { Effects } from '../canvas/Effects'
import { VerticalText } from '../ui/VerticalText'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useScrollParallax } from '../../hooks/useScrollParallax'
import { useExitGlitch } from '../../hooks/useExitGlitch'

export function Hero() {
  const ref = useScrollEntry({ flashBefore: false, staggerMs: 55, threshold: 0.05 })
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const productRef = useRef<HTMLDivElement>(null)

  // Scroll-scrubbed parallax — headline drifts up faster than scroll
  useScrollParallax(headlineRef, -0.18)
  useScrollParallax(productRef, -0.08)

  // Glitch Hero content when exiting the section
  useExitGlitch(ref as React.RefObject<HTMLElement>, 'hero')

  return (
    <section
      id="hero"
      data-section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}
    >
      {/* 3D canvas — always visible, no entry animation on the canvas itself */}
      <Scene cameraPosition={[0, 0.4, 5]} fov={36}>
        <Lights />
        <Model />
        <Effects />
      </Scene>

      <VerticalText text="TRAXUS // DEVELOPMENT OPERATIONS · REPORT-ID: SYSTEM-DELTA-412" side="left" top="50%" />
      <VerticalText text="[ FIELD OP ] ACTIVE — CONTINUOUS OUTPUT" side="right" top="50%" color="var(--text-dim)" />

      {/* Top-left product mark */}
      <div ref={productRef} data-glitch style={{ position: 'absolute', top: 40, left: 40, zIndex: 20, pointerEvents: 'none', willChange: 'transform' }}>
        <div data-entry className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6 }}>
          [ PRODUCT ID — SPECTER ONE ]
        </div>
        <div data-entry className="type-display" style={{ fontSize: 44, color: 'var(--amber)', lineHeight: 0.9 }}>
          ARC //<br />SPECTER ONE
        </div>
      </div>

      {/* Top-right metadata */}
      <div
        data-entry
        style={{
          position: 'absolute', top: 40, right: 40, zIndex: 20,
          textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ color: 'var(--text-dim)' }}>[ CONNECTION ESTABLISHED ]</div>
        <div style={{ marginTop: 6 }}>SIG: <span style={{ color: 'var(--text)' }}>NOMINAL</span></div>
        <div>LAT: <span style={{ color: 'var(--text)' }}>−23.5505°</span></div>
        <div>LON: <span style={{ color: 'var(--text)' }}>−46.6333°</span></div>
        <div>ALT: <span style={{ color: 'var(--text)' }}>744M</span></div>
      </div>

      {/* Bottom block */}
      <div style={{
        position: 'absolute', bottom: 60, left: 40, right: 40,
        zIndex: 20, display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', pointerEvents: 'none',
      }}>
        <div>
          <div data-entry className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>
            [ OFFICE OF TRAXUS // BRASS HANDS × MARATHON ]
          </div>
          <h1
            ref={headlineRef}
            data-entry
            data-glitch
            className="type-display"
            style={{ fontSize: 'clamp(48px, 7vw, 112px)', color: 'var(--text)', maxWidth: '17ch', margin: 0, lineHeight: 0.9, willChange: 'transform' }}
          >
            Designing for the<br />New Industrial Age
          </h1>
        </div>

        <div data-entry style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--amber)', textAlign: 'right', lineHeight: 1.8,
        }}>
          <div>STATUS: <span style={{ color: 'var(--text)' }}>DEPLOYED IN SECTOR</span></div>
          <div>AI / ROBOTICS / DEFENSE / INDUSTRY</div>
          <div style={{ color: 'var(--text-dim)', marginTop: 8 }}>
            ▸ SCROLL TO ADVANCE <span className="blink">▌</span>
          </div>
        </div>
      </div>
    </section>
  )
}
