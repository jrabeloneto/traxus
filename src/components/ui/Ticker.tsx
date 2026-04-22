interface TickerProps {
  items?: string[]
  speed?: number // seconds per loop
  position?: 'top' | 'bottom'
}

const DEFAULT_ITEMS = [
  'TRAXUS STORE: DEPLOYED',
  'LIMITED RELEASE: [01] RE-IND ISSUE',
  'FIELD OPERATION: ACTIVE',
  'STATUS: CONTINUOUS OUTPUT',
  'REPORT ID: SYSTEM-DELTA-412',
  'ENGAGE COMMAND FOR MISSION BRIEFING',
]

export function Ticker({
  items = DEFAULT_ITEMS,
  speed = 45,
  position = 'bottom',
}: TickerProps) {
  // duplicate items so the marquee can loop seamlessly
  const loop = [...items, ...items]

  return (
    <div
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height: 22,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.9)',
        borderTop: position === 'bottom' ? '1px solid var(--amber-border)' : 'none',
        borderBottom: position === 'top' ? '1px solid var(--amber-border)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          animation: `marquee ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {loop.map((text, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              padding: '0 24px',
              borderLeft: '1px solid var(--amber-border)',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
