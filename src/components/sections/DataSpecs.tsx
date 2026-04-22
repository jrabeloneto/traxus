import { useEffect, useRef, useState } from 'react'
import { AsciiBlock } from '../ui/AsciiBlock'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

/** Counts a number up from 0 once it becomes visible */
function useCountUp(target: number, duration = 1200, active = false) {
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    const steps = 18
    const step = target / steps
    const interval = duration / steps
    let current = 0
    const id = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(id) }
      else setVal(Math.floor(current))
    }, interval)
    return () => clearInterval(id)
  }, [active, target, duration])

  return val
}

interface MetricProps {
  label: string
  rawValue: number
  display: (n: number) => string
  suffix?: string
  accent?: boolean
  active?: boolean
}

function Metric({ label, rawValue, display, suffix, accent, active }: MetricProps) {
  const counted = useCountUp(rawValue, 1100, !!active)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="type-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>[ {label} ]</div>
      <div data-glitch className="type-display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', color: accent ? 'var(--amber)' : 'var(--text)', lineHeight: 0.9 }}>
        {display(counted)}
        {suffix && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-dim)', marginLeft: 8, letterSpacing: '0.2em' }}>{suffix}</span>}
      </div>
    </div>
  )
}

export function DataSpecs() {
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 60, threshold: 0.08 })
  const [active, setActive] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  useExitGlitch(sectionRef, 'specs')

  // Activate count-up when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Merge both refs
  function mergeRef(el: HTMLElement | null) {
    sectionRef.current = el
    ;(ref as React.MutableRefObject<HTMLElement | null>).current = el
  }

  return (
    <section
      id="specs"
      data-section
      ref={mergeRef}
      style={{
        position: 'relative', minHeight: '100vh',
        padding: '120px 48px', background: '#000',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'auto', gap: 32,
      }}
    >
      {/* Section header */}
      <div style={{ gridColumn: '1 / 7' }}>
        <div data-entry className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 12, letterSpacing: '0.3em' }}>
          [ PHASE 04 / SYSTEM SPECS ]
        </div>
        <h2 data-entry className="type-display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', color: 'var(--text)', lineHeight: 0.9 }}>
          Continuous Output.<br />
          <span style={{ color: 'var(--amber)' }}>Zero Drift.</span>
        </h2>
      </div>

      <div style={{ gridColumn: '8 / 13', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        <div data-entry>
          <AsciiBlock lines={['TRAXUS // BRAND DEVELOPMENT OPS', 'REPORT ID: SYSTEM-DELTA-412', 'STATUS: CONTINUOUS OUTPUT', 'CLEARANCE: ACTIVE']} />
        </div>
      </div>

      {/* Metrics — count-up on entry */}
      <div data-entry style={{ gridColumn: '1 / 4' }}>
        <Metric label="FIELD UNITS DEPLOYED" rawValue={412} display={n => String(n)} suffix="UNITS" accent active={active} />
      </div>
      <div data-entry style={{ gridColumn: '4 / 7' }}>
        <Metric label="SECTORS COVERED" rawValue={8} display={n => String(n).padStart(2,'0')} suffix="/ 12" active={active} />
      </div>
      <div data-entry style={{ gridColumn: '7 / 10' }}>
        <Metric label="UPTIME" rawValue={9997} display={n => (n / 100).toFixed(2)} suffix="%" active={active} />
      </div>
      <div data-entry style={{ gridColumn: '10 / 13' }}>
        <Metric label="RESPONSE WINDOW" rawValue={48} display={n => `≤ ${n}`} suffix="H" accent active={active} />
      </div>

      {/* Divider */}
      <div data-entry style={{
        gridColumn: '1 / 13', height: 1,
        background: 'repeating-linear-gradient(to right, var(--amber) 0, var(--amber) 6px, transparent 6px, transparent 12px)',
        opacity: 0.5,
      }} />

      {/* Capabilities */}
      <div data-entry style={{ gridColumn: '1 / 5' }}>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 14 }}>[ CAPABILITIES ]</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 2 }}>
          <li>▸ BRAND SYSTEMS</li>
          <li>▸ INDUSTRIAL IDENTITY</li>
          <li>▸ 3D / MOTION DESIGN</li>
          <li>▸ PRODUCT NARRATIVE</li>
          <li>▸ DEFENSE-GRADE ART DIR.</li>
        </ul>
      </div>

      <div data-entry style={{ gridColumn: '5 / 9' }}>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 14 }}>[ SECTORS ]</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 2 }}>
          <li>▸ AI / AUTONOMOUS SYSTEMS</li>
          <li>▸ ROBOTICS / ACTUATION</li>
          <li>▸ DEFENSE / AEROSPACE</li>
          <li>▸ INDUSTRIAL LOGISTICS</li>
          <li>▸ ENERGY / SUBSURFACE</li>
        </ul>
      </div>

      <div data-entry style={{ gridColumn: '9 / 13' }}>
        <div className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 14 }}>[ TELEMETRY ]</div>
        <pre style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)',
          letterSpacing: '0.08em', lineHeight: 1.8, margin: 0, padding: 16,
          border: '1px solid var(--amber-border)', background: 'rgba(255,101,0,0.04)', whiteSpace: 'pre',
        }}>
{`PR:80    AC:0025    FER:4
SOC:4.4  PTDR:3     10025
0x1A3F   0x8801     0xFFA2
COMMANDATROS — ANALITCS
SIG ... ████████░░░ 87%`}
        </pre>
      </div>
    </section>
  )
}
