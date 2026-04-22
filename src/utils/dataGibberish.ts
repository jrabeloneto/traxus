/**
 * Data gibberish generator — intentionally unreadable HUD metadata.
 * Mirrors the corrupted-sensor strings visible in the @kyleanthony ARC reel.
 */

const PREFIXES = [
  'PR', 'AC', 'FER', 'PTDR', 'SOC', 'CMD', 'ID', 'REF',
  'SYS', 'ARC', 'TRX', 'SEC', 'DLT', 'CNT', 'OPS',
]

const SUFFIXES = [
  'COMMANDATROS', 'ANALITCS', 'DELTA', 'SECTOR', 'ACTIVE',
  'NOMINAL', 'DEPLOYED', 'LIVE', 'STANDBY', 'ENGAGED',
  'ROUTED', 'LINKED', 'SEALED',
]

const HEX_CHARS = '0123456789ABCDEF'

function randInt(max: number) {
  return Math.floor(Math.random() * max)
}

function pick<T>(arr: T[]): T {
  return arr[randInt(arr.length)]
}

function padZero(n: number, width: number) {
  return n.toString().padStart(width, '0')
}

function hex(len: number) {
  let s = ''
  for (let i = 0; i < len; i++) s += HEX_CHARS[randInt(16)]
  return s
}

export function generateDataPoint(): string {
  const r = Math.random()

  if (r < 0.30) {
    // PREFIX:NNNN
    return `${pick(PREFIXES)}:${padZero(randInt(10000), 4)}`
  }

  if (r < 0.45) {
    // long fixed decimal
    return (Math.random() * 1000).toFixed(Math.random() > 0.5 ? 4 : 2)
  }

  if (r < 0.58) {
    // short integer
    return padZero(randInt(10000), 4)
  }

  if (r < 0.72) {
    // hex id
    return `0x${hex(4 + randInt(4))}`
  }

  if (r < 0.85) {
    // suffix string
    return pick(SUFFIXES)
  }

  if (r < 0.94) {
    // prefix + suffix
    return `${pick(PREFIXES)} ${pick(SUFFIXES)}`
  }

  // fractional coordinate
  return `${(Math.random() * 360).toFixed(1)}°`
}

export interface DataPoint {
  id: number
  text: string
  x: number // % of viewport
  y: number // % of viewport
  opacity: number
  size: number // px
  hasBlock: boolean
  drift: number // seeds flicker
}

export function createDataPoints(count = 35): DataPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: generateDataPoint(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: 0.3 + Math.random() * 0.7,
    size: 8 + Math.floor(Math.random() * 5),
    hasBlock: Math.random() > 0.6,
    drift: Math.random(),
  }))
}
