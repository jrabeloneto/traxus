/**
 * Timing constants — every number here is a frame budget, in seconds.
 * Derived from frame-by-frame analysis of the Brass Hands × ARC reel.
 */

export const FRAME = 1 / 60 // 16.6ms at 60fps

export const FLASH = {
  /** Single hard-cut to black between scenes. ~3 frames. */
  black: 0.05,
  /** Polarity inversion — one frame only. */
  white: FRAME,
  /** Hold duration between flashes. */
  hold: 0.25,
  /** VHS-style noise dropout before a cut. */
  noise: 0.08,
} as const

export const PARTICLE = {
  /** Seconds to fully construct. */
  buildDuration: 8.0,
  /** Seconds to hold the completed object before reset. */
  holdDuration: 2.0,
  /** Per-frame probability of a glitch burst. */
  glitchChance: 0.003,
} as const
