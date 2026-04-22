import { useEffect, useState } from 'react'

type NavItem = { id: string; label: string }

const ITEMS: NavItem[] = [
  { id: 'hero',      label: 'INTRO' },
  { id: 'manifesto', label: 'DOCTRINE' },
  { id: 'construct', label: 'CONSTRUCT' },
  { id: 'identity',  label: 'IDENTITY' },
  { id: 'specs',     label: 'SPECS' },
  { id: 'terminal',  label: 'TERMINAL' },
  { id: 'sectors',   label: 'SECTORS' },
  { id: 'log',       label: 'TELEMETRY' },
  { id: 'contact',   label: 'CONTACT' },
  { id: 'end',       label: 'END' },
]

export function SideNav() {
  const [activeId, setActiveId] = useState<string>('hero')

  useEffect(() => {
    function onActive(e: Event) {
      const d = (e as CustomEvent).detail as { id: string }
      if (d?.id) setActiveId(d.id)
    }
    window.addEventListener('traxus:section-active', onActive as EventListener)
    return () => window.removeEventListener('traxus:section-active', onActive as EventListener)
  }, [])

  const activeIdx = ITEMS.findIndex(i => i.id === activeId)
  const total = ITEMS.length

  return (
    <nav
      aria-label="section-progress"
      style={{
        position: 'fixed',
        top: '50%',
        left: 24,
        transform: 'translateY(-50%)',
        zIndex: 50,
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.22em',
        pointerEvents: 'auto',
      }}
    >
      {/* Phase counter */}
      <div style={{ color: 'var(--amber)', marginBottom: 12, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        PHASE {(activeIdx + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
      </div>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0 }}>
        {ITEMS.map((item, i) => {
          const isActive = item.id === activeId
          const isPast = i < activeIdx
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('traxus:goto', { detail: { id: item.id } }))
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '14px 10px auto',
                  alignItems: 'center',
                  gap: 8,
                  textDecoration: 'none',
                  color: isActive ? 'var(--amber)' : isPast ? 'var(--text-dim)' : 'var(--text-dim)',
                  cursor: 'crosshair',
                }}
              >
                <span style={{ color: isActive ? 'var(--amber)' : 'var(--text-dim)', fontSize: 8 }}>
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span style={{
                  display: 'inline-block',
                  width: 10,
                  height: 1,
                  background: isActive ? 'var(--amber)' : isPast ? 'var(--amber-border)' : 'rgba(85,80,80,0.6)',
                }} />
                <span
                  style={{
                    opacity: isActive ? 1 : 0.55,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                  {isActive && <span style={{ marginLeft: 6, color: 'var(--amber)' }}>◂</span>}
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      {/* Progress bar */}
      <div style={{ marginTop: 14, height: 1, background: 'rgba(85,80,80,0.5)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${((activeIdx + 1) / total) * 100}%`,
          background: 'var(--amber)',
        }} />
      </div>
    </nav>
  )
}
