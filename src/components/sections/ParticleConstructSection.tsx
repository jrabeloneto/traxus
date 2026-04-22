import { useState } from 'react'
import { Scene } from '../canvas/Scene'
import { ParticleConstruct } from '../canvas/ParticleConstruct'
import { Effects } from '../canvas/Effects'
import { ConstructLabel } from '../ui/ConstructLabel'
import { VerticalText } from '../ui/VerticalText'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

export function ParticleConstructSection() {
  const [progress, setProgress] = useState(0)
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 70, threshold: 0.08 })
  useExitGlitch(ref as React.RefObject<HTMLElement>, 'construct')

  return (
    <section
      id="construct"
      data-section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: '#000' }}
    >
      <Scene cameraPosition={[0, 0, 6]} fov={40}>
        <ambientLight intensity={0.1} />
        <ParticleConstruct onProgress={setProgress} />
        <Effects intense />
      </Scene>

      <VerticalText text="// CONSTRUCT PHASE — RENDER LOOP · 8.0s" side="left" top="50%" />

      <div
        data-entry
        data-glitch
        style={{
          position: 'absolute', top: 40, left: 40, right: 40, zIndex: 20,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--amber)', pointerEvents: 'none',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-dim)' }}>[ PHASE 02 / IDENTITY RENDER ]</div>
          <div style={{ marginTop: 6, color: 'var(--text)' }}>OBJECT: ARC-IND-CORE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-dim)' }}>POINTS: <span style={{ color: 'var(--text)' }}>1920</span></div>
          <div>CURVES: <span style={{ color: 'var(--text)' }}>24</span></div>
          <div>MODE: <span style={{ color: 'var(--amber-hot)' }}>CONTINUOUS</span></div>
        </div>
      </div>

      <ConstructLabel progress={progress} />
    </section>
  )
}
