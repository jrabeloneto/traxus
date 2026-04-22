import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLASH } from '../../utils/timing'
import { useExitGlitch } from '../../hooks/useExitGlitch'

gsap.registerPlugin(ScrollTrigger)

/* ── frame definitions ─────────────────────── */

type FrameKind =
  | { kind: 'logo' }
  | { kind: 'black' }
  | { kind: 'invert' }
  | { kind: 'product'; text: string; subtitle: string }
  | { kind: 'data' }
  | { kind: 'arrow' }
  | { kind: 'grid' }
  | { kind: 'crosshair' }
  | { kind: 'stripes' }
  | { kind: 'command' }

const SEQUENCE: FrameKind[] = [
  { kind: 'logo' },
  { kind: 'black' },
  { kind: 'crosshair' },
  { kind: 'invert' },
  { kind: 'product', text: 'SPECTER / 01', subtitle: 'RE-IND ISSUE' },
  { kind: 'black' },
  { kind: 'stripes' },
  { kind: 'data' },
  { kind: 'black' },
  { kind: 'arrow' },
  { kind: 'invert' },
  { kind: 'grid' },
  { kind: 'black' },
  { kind: 'product', text: 'COMMAND / 02', subtitle: 'FIELD UNIT' },
  { kind: 'black' },
  { kind: 'command' },
  { kind: 'black' },
  { kind: 'logo' },
  { kind: 'invert' },
]

const HOLDS: Record<FrameKind['kind'], number> = {
  black:     FLASH.black,
  invert:    FLASH.white,
  logo:      FLASH.hold,
  product:   FLASH.hold * 1.2,
  data:      FLASH.hold * 1.4,
  arrow:     FLASH.hold * 0.9,
  grid:      FLASH.hold,
  crosshair: FLASH.hold * 0.7,
  stripes:   FLASH.hold * 0.5,
  command:   FLASH.hold,
}

/* ── sub-renders ───────────────────────────── */

function CrosshairFrame() {
  const s = 260
  const c = s / 2
  const r = c * 0.8
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={c} cy={c} r={r} stroke="#FF6500" strokeWidth={1.5} />
      <circle cx={c} cy={c} r={r * 0.35} stroke="#FF6500" strokeWidth={1} />
      <circle cx={c} cy={c} r={3} fill="#FF6500" />
      <line x1={c} y1={4} x2={c} y2={c - r * 0.42} stroke="#FF6500" strokeWidth={2} />
      <line x1={c} y1={c + r * 0.42} x2={c} y2={s - 4} stroke="#FF6500" strokeWidth={2} />
      <line x1={4} y1={c} x2={c - r * 0.42} y2={c} stroke="#FF6500" strokeWidth={2} />
      <line x1={c + r * 0.42} y1={c} x2={s - 4} y2={c} stroke="#FF6500" strokeWidth={2} />
      {/* corner ticks */}
      {[0, 1, 2, 3].map(i => {
        const a = (Math.PI / 2) * i + Math.PI / 4
        const tx = c + r * Math.cos(a)
        const ty = c + r * Math.sin(a)
        const tx2 = c + r * 0.88 * Math.cos(a)
        const ty2 = c + r * 0.88 * Math.sin(a)
        return <line key={i} x1={tx} y1={ty} x2={tx2} y2={ty2} stroke="#FF6500" strokeWidth={1.5} />
      })}
      <text x={c} y={c + r + 18} textAnchor="middle" fill="#FF6500" fontFamily="'IBM Plex Mono'" fontSize="11" letterSpacing="3">TARGET LOCKED</text>
    </svg>
  )
}

function ArrowFrame() {
  return (
    <svg width={360} height={220} viewBox="0 0 360 220" fill="none">
      <polygon
        points="12,110 220,12 220,64 348,64 348,156 220,156 220,208"
        stroke="#FF6500"
        strokeWidth={2.5}
        fill="none"
      />
      {/* inner ghost duplicate */}
      <polygon
        points="30,110 208,30 208,76 336,76 336,144 208,144 208,190"
        stroke="rgba(255,101,0,0.25)"
        strokeWidth={1}
        fill="none"
      />
      {/* centre axis */}
      <line x1={220} y1={110} x2={348} y2={110} stroke="rgba(255,101,0,0.4)" strokeWidth={1} />
      {/* corner markers */}
      <circle cx={220} cy={64} r={4} fill="#FF6500" />
      <circle cx={220} cy={156} r={4} fill="#FF6500" />
    </svg>
  )
}

function GridFrame() {
  const cols = 8
  const rows = 5
  const cw = 1440 / cols
  const rh = 900 / rows
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      fill="none"
      style={{ position: 'absolute', inset: 0 }}
      preserveAspectRatio="none"
    >
      {/* vertical lines */}
      {Array.from({ length: cols - 1 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={(i + 1) * cw} y1={0}
          x2={(i + 1) * cw} y2={900}
          stroke="rgba(255,101,0,0.25)" strokeWidth={0.8}
        />
      ))}
      {/* horizontal lines */}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={0} y1={(i + 1) * rh}
          x2={1440} y2={(i + 1) * rh}
          stroke="rgba(255,101,0,0.25)" strokeWidth={0.8}
        />
      ))}
      {/* diagonal */}
      <line x1={0} y1={0} x2={1440} y2={900} stroke="rgba(255,101,0,0.12)" strokeWidth={0.8} />
      <line x1={1440} y1={0} x2={0} y2={900} stroke="rgba(255,101,0,0.12)" strokeWidth={0.8} />
      {/* center mark */}
      <circle cx={720} cy={450} r={40} stroke="#FF6500" strokeWidth={1} fill="none" />
      <circle cx={720} cy={450} r={4} fill="#FF6500" />
    </svg>
  )
}

function StripesFrame() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `repeating-linear-gradient(
        -48deg,
        rgba(255,101,0,0.07) 0px,
        rgba(255,101,0,0.07) 2px,
        transparent 2px,
        transparent 18px
      )`,
    }} />
  )
}

function CommandFrame() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.3em', marginBottom: 20 }}>
        ▸ /ENGAGE_COMMAND --CLEARANCE=DELTA
      </div>
      <pre style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--amber)',
        letterSpacing: '0.15em',
        lineHeight: 1.9,
        margin: 0,
        textAlign: 'left',
        display: 'inline-block',
      }}>
{`> LOADING MANIFEST................. [OK]
> VERIFYING CLEARANCE: DELTA-412 .. [OK]
> MOUNTING SECTOR: INDUSTRIAL ...... [OK]
> ENGAGING DESIGN OPS .............. [ACTIVE]
> STATUS ........................... [DEPLOYED]
> ▌`}
      </pre>
    </div>
  )
}

/* ── main component ────────────────────────── */

export function IdentityFlash() {
  const root = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  useExitGlitch(root, 'identity')

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
          toggleActions: 'play pause resume reset',
        },
        repeat: -1,
      })

      SEQUENCE.forEach((frame, i) => {
        tl.call(() => setIndex(i))
        tl.to({}, { duration: HOLDS[frame.kind] })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const frame = SEQUENCE[index]
  const isWhite = frame.kind === 'invert'
  const isBlack = frame.kind === 'black'

  return (
    <section
      ref={root}
      id="identity"
      data-section
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: isWhite ? '#FFFFFF' : '#000000',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: isWhite ? 'invert(1)' : 'none',
        }}
      >
        {/* ── LOGO ── */}
        {frame.kind === 'logo' && (
          <div className="type-display" style={{ fontSize: 'clamp(80px, 14vw, 200px)', color: 'var(--text)', letterSpacing: '-0.02em', textAlign: 'center' }}>
            TRAXUS
          </div>
        )}

        {/* ── PRODUCT ── */}
        {frame.kind === 'product' && (
          <div style={{ textAlign: 'center' }}>
            <div className="type-mono" style={{ fontSize: 11, color: 'var(--amber)', marginBottom: 12, letterSpacing: '0.3em' }}>
              [ {frame.subtitle} ]
            </div>
            <div className="type-display" style={{ fontSize: 'clamp(72px, 11vw, 160px)', color: 'var(--amber)', letterSpacing: '-0.02em' }}>
              {frame.text}
            </div>
          </div>
        )}

        {/* ── DATA ── */}
        {frame.kind === 'data' && (
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontSize: 12, letterSpacing: '0.18em' }}>
            <pre style={{ margin: 0, lineHeight: 1.9 }}>
{`[ CONNECTION ESTABLISHED ]
────────────────────────────
  ARC // IND-CORE
  PR:80    AC:0025    FER:4
  SOC:4.4  PTDR:3     10025
  COMMANDATROS · ANALITCS
────────────────────────────
  [ STREAM: LIVE ]`}
            </pre>
          </div>
        )}

        {/* ── ARROW ── */}
        {frame.kind === 'arrow' && <ArrowFrame />}

        {/* ── GRID ── */}
        {frame.kind === 'grid' && <GridFrame />}

        {/* ── CROSSHAIR ── */}
        {frame.kind === 'crosshair' && <CrosshairFrame />}

        {/* ── STRIPES ── */}
        {frame.kind === 'stripes' && (
          <>
            <StripesFrame />
            <div className="type-display" style={{ position: 'relative', fontSize: 'clamp(60px, 9vw, 130px)', color: 'var(--amber)', letterSpacing: '-0.01em', mixBlendMode: 'screen' }}>
              ARC / SECTOR
            </div>
          </>
        )}

        {/* ── COMMAND ── */}
        {frame.kind === 'command' && <CommandFrame />}

        {/* black frame — nothing */}
        {isBlack && null}
      </div>

      {/* section label — only on non-black frames */}
      {!isBlack && (
        <div style={{
          position: 'absolute',
          top: 36,
          left: 40,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: isWhite ? '#000' : 'var(--amber)',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          [ PHASE 03 / IDENTITY FLASH ]
        </div>
      )}

      {/* frame counter — bottom right */}
      {!isBlack && (
        <div style={{
          position: 'absolute',
          bottom: 36,
          right: 40,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: isWhite ? '#000' : 'var(--text-dim)',
          letterSpacing: '0.18em',
        }}>
          FRAME {String(index + 1).padStart(2, '0')} / {String(SEQUENCE.length).padStart(2, '0')}
        </div>
      )}
    </section>
  )
}
