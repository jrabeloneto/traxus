import { useState } from 'react'
import { AsciiBlock } from '../ui/AsciiBlock'
import { useScrollEntry } from '../../hooks/useScrollEntry'
import { useExitGlitch } from '../../hooks/useExitGlitch'

export function Contact() {
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [brief, setBrief] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useScrollEntry({ flashBefore: true, staggerMs: 65, threshold: 0.08 })
  useExitGlitch(ref as React.RefObject<HTMLElement>, 'contact')

  const fieldStyle = {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--amber-border)',
    outline: 'none',
    padding: '12px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--text)',
    caretColor: 'var(--amber)',
    transition: 'none',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--amber)',
    display: 'block',
    marginBottom: 8,
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section
      id="contact"
      data-section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        position: 'relative', minHeight: '100vh',
        padding: '120px 48px 120px', background: '#000',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32,
      }}
    >
      <div style={{ gridColumn: '1 / 7' }}>
        <div data-entry className="type-mono" style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 12, letterSpacing: '0.3em' }}>
          [ PHASE 05 / ENGAGE COMMAND ]
        </div>
        <h2 data-entry data-glitch className="type-display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', color: 'var(--text)', lineHeight: 0.9, marginBottom: 32 }}>
          Engage Command<br />
          <span style={{ color: 'var(--amber)' }}>for Mission Briefing.</span>
        </h2>
        <div data-entry>
          <AsciiBlock lines={['TRAXUS // BRASS HANDS × MARATHON', 'ENGAGE DESIGN OPS — ALL WORK IS OUR OWN', 'OFFICE: REMOTE / SECTOR-0', 'CHANNEL: OPEN — 24H / 7D']} />
        </div>
      </div>

      {/* Terminal form */}
      <div style={{ gridColumn: '7 / 13' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div data-entry style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--amber)', padding: '8px 0',
            borderBottom: '1px solid var(--amber-border)',
          }}>
            ▸ /ENGAGE_COMMAND --INPUT <span className="blink">▌</span>
          </div>

          <div data-entry>
            <label style={labelStyle}>▸ OPERATIVE NAME</label>
            <input style={fieldStyle} value={name} onChange={e => setName(e.target.value)} placeholder="ENTER DESIGNATION..." />
          </div>

          <div data-entry>
            <label style={labelStyle}>▸ ORG / UNIT</label>
            <input style={fieldStyle} value={org} onChange={e => setOrg(e.target.value)} placeholder="ENTER ORGANIZATION..." />
          </div>

          <div data-entry>
            <label style={labelStyle}>▸ MISSION BRIEF</label>
            <textarea style={{ ...fieldStyle, minHeight: 140, resize: 'vertical' }} value={brief} onChange={e => setBrief(e.target.value)} placeholder="OUTLINE OBJECTIVES, SECTOR, TIMELINE..." />
          </div>

          <div data-entry>
            <button type="submit" className="chamfer" style={{
              background: 'var(--amber)', color: 'var(--bg)',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '18px 28px', border: 'none', cursor: 'crosshair',
              display: 'block',
            }}>
              {sent ? 'TRANSMISSION RECEIVED ▌' : 'ENGAGE DESIGN OPS →'}
            </button>
          </div>
        </form>

        <div data-entry style={{
          marginTop: 64, paddingTop: 24,
          borderTop: '1px dashed var(--amber-border)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--text-dim)',
        }}>
          <span>ALL WORK IS OUR OWN</span>
          <span>TRAXUS, LLC · {new Date().getFullYear()}</span>
          <span style={{ color: 'var(--amber)' }}>END OF STREAM ■</span>
        </div>
      </div>
    </section>
  )
}
