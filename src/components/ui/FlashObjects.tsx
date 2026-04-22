import { useEffect, useState, useCallback } from 'react'

/**
 * Hard-cut geometric/text objects that flash into existence at random
 * screen positions for 50–300ms then vanish.
 *
 * Object types:
 *   - triangle wireframe (SVG)
 *   - crosshair / target reticle
 *   - bold display text burst (ARC, SYS, 01/12, etc.)
 *   - bracket frame
 *   - diagonal slash marks
 *   - rectangle frame
 *   - hexagonal outline
 */

type ObjKind =
  | 'triangle'
  | 'reticle'
  | 'text'
  | 'bracket'
  | 'slashes'
  | 'rect'
  | 'hex'
  | 'corner'

interface FlashObj {
  id: number
  kind: ObjKind
  x: number  // vw %
  y: number  // vh %
  size: number
  color: string
  text?: string
  angle: number
}

const TEXTS = [
  'ARC', 'SYS', '01 / 12', 'DELTA', '▲', '◉', '⬡',
  'TRX', 'SEC', 'CMD', '00:00', 'LIVE', 'ACT',
  '→', '↗', '///', '<<<', '▶▶', 'ID:0',
]

const KINDS: ObjKind[] = [
  'triangle', 'triangle',
  'reticle', 'reticle',
  'text', 'text', 'text',
  'bracket',
  'slashes',
  'rect',
  'hex',
  'corner', 'corner',
]

const COLORS = [
  '#FF6500', '#FF6500', '#FF6500', // mostly amber
  '#00D4FF',                        // occasional cyan
  '#F5F0E8',                        // occasional cream
]

let uid = 0
function next() { return ++uid }

function randIn<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)] }
function randRange(min: number, max: number) { return Math.random() * (max - min) + min }

function buildObj(): FlashObj {
  return {
    id: next(),
    kind: randIn(KINDS),
    x: randRange(5, 90),
    y: randRange(10, 85),
    size: randRange(40, 180),
    color: randIn(COLORS),
    text: randIn(TEXTS),
    angle: randIn([0, 0, 0, 15, -15, 30, -30, 45, -45]),
  }
}

/* ── SVG shapes ──────────────────────────────── */
function Triangle({ size, color }: { size: number; color: string }) {
  const h = size * 0.866
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} fill="none">
      <polygon
        points={`${size / 2},2 ${size - 2},${h - 2} 2,${h - 2}`}
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </svg>
  )
}

function Reticle({ size, color }: { size: number; color: string }) {
  const c = size / 2
  const r = c * 0.72
  const gap = r * 0.4
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={c} cy={c} r={r} stroke={color} strokeWidth={1.5} />
      <circle cx={c} cy={c} r={r * 0.22} stroke={color} strokeWidth={1} />
      {/* crosshair ticks */}
      <line x1={c} y1={2} x2={c} y2={c - gap} stroke={color} strokeWidth={1.5} />
      <line x1={c} y1={c + gap} x2={c} y2={size - 2} stroke={color} strokeWidth={1.5} />
      <line x1={2} y1={c} x2={c - gap} y2={c} stroke={color} strokeWidth={1.5} />
      <line x1={c + gap} y1={c} x2={size - 2} y2={c} stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

function BracketFrame({ size, color }: { size: number; color: string }) {
  const w = size
  const h = size * 0.6
  const d = size * 0.14
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      {/* top-left */}
      <polyline points={`${d},0 0,0 0,${d}`} stroke={color} strokeWidth={2} fill="none" />
      {/* top-right */}
      <polyline points={`${w - d},0 ${w},0 ${w},${d}`} stroke={color} strokeWidth={2} fill="none" />
      {/* bottom-left */}
      <polyline points={`${d},${h} 0,${h} 0,${h - d}`} stroke={color} strokeWidth={2} fill="none" />
      {/* bottom-right */}
      <polyline points={`${w - d},${h} ${w},${h} ${w},${h - d}`} stroke={color} strokeWidth={2} fill="none" />
    </svg>
  )
}

function Slashes({ size, color }: { size: number; color: string }) {
  const s = size
  return (
    <svg width={s} height={s * 0.5} viewBox={`0 0 ${s} ${s * 0.5}`} fill="none">
      {[0, 1, 2, 3].map(i => (
        <line
          key={i}
          x1={s * 0.05 + i * s * 0.25}
          y1={s * 0.45}
          x2={s * 0.2 + i * s * 0.25}
          y2={0}
          stroke={color}
          strokeWidth={i === 1 ? 3 : 1.5}
          strokeOpacity={i === 1 ? 1 : 0.5}
        />
      ))}
    </svg>
  )
}

function RectFrame({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 0.55} viewBox={`0 0 ${size} ${size * 0.55}`} fill="none">
      <rect x={1} y={1} width={size - 2} height={size * 0.55 - 2} stroke={color} strokeWidth={1.5} />
      <line x1={0} y1={size * 0.275} x2={size * 0.08} y2={size * 0.275} stroke={color} strokeWidth={1.5} />
      <line x1={size * 0.92} y1={size * 0.275} x2={size} y2={size * 0.275} stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

function HexOutline({ size, color }: { size: number; color: string }) {
  const c = size / 2
  const r = c * 0.9
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`
  }).join(' ')
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <polygon points={pts} stroke={color} strokeWidth={1.5} fill="none" />
    </svg>
  )
}

function CornerMark({ size, color }: { size: number; color: string }) {
  const d = size * 0.35
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <polyline points={`0,${d} 0,0 ${d},0`} stroke={color} strokeWidth={2} />
      <polyline points={`${size - d},0 ${size},0 ${size},${d}`} stroke={color} strokeWidth={2} />
      <polyline points={`0,${size - d} 0,${size} ${d},${size}`} stroke={color} strokeWidth={2} />
      <polyline points={`${size},${size - d} ${size},${size} ${size - d},${size}`} stroke={color} strokeWidth={2} />
    </svg>
  )
}

/* ── component ───────────────────────────────── */

interface Props {
  /** max simultaneous objects on screen */
  maxSimult?: number
  minInterval?: number
  maxInterval?: number
  /** how long each object stays visible (ms) */
  minDuration?: number
  maxDuration?: number
}

export function FlashObjects({
  maxSimult = 2,
  minInterval = 400,
  maxInterval = 1800,
  minDuration = 60,
  maxDuration = 280,
}: Props) {
  const [objs, setObjs] = useState<FlashObj[]>([])

  const flash = useCallback(() => {
    const count = Math.random() > 0.7 ? 2 : 1
    const newObjs = Array.from({ length: Math.min(count, maxSimult) }, buildObj)
    setObjs(newObjs)
    const dur = randRange(minDuration, maxDuration)
    setTimeout(() => setObjs([]), dur)
  }, [maxSimult, minDuration, maxDuration])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function schedule() {
      const delay = randRange(minInterval, maxInterval)
      timeout = setTimeout(() => { flash(); schedule() }, delay)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [flash, minInterval, maxInterval])

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 802, overflow: 'hidden' }}
    >
      {objs.map(obj => (
        <div
          key={obj.id}
          style={{
            position: 'absolute',
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            transform: `translate(-50%, -50%) rotate(${obj.angle}deg)`,
            transition: 'none',
            mixBlendMode: 'screen',
            filter: `drop-shadow(0 0 6px ${obj.color})`,
          }}
        >
          {obj.kind === 'triangle' && <Triangle size={obj.size} color={obj.color} />}
          {obj.kind === 'reticle' && <Reticle size={obj.size} color={obj.color} />}
          {obj.kind === 'text' && (
            <span style={{
              fontFamily: "'Barlow Condensed', 'Bebas Neue', sans-serif",
              fontWeight: 900,
              fontSize: obj.size,
              color: obj.color,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}>
              {obj.text}
            </span>
          )}
          {obj.kind === 'bracket' && <BracketFrame size={obj.size} color={obj.color} />}
          {obj.kind === 'slashes' && <Slashes size={obj.size} color={obj.color} />}
          {obj.kind === 'rect' && <RectFrame size={obj.size} color={obj.color} />}
          {obj.kind === 'hex' && <HexOutline size={obj.size} color={obj.color} />}
          {obj.kind === 'corner' && <CornerMark size={obj.size} color={obj.color} />}
        </div>
      ))}
    </div>
  )
}
