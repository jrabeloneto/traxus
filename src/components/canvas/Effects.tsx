import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
  Scanline,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { GlitchMode, BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { useMemo } from 'react'

interface Props {
  intense?: boolean
}

/**
 * Post pipeline. Intensity has two modes:
 *  - normal:   subtle scanline + noise, very light chromatic offset
 *  - intense:  bumps the glitch rate and chromatic offset (Particle Construct section)
 */
export function Effects({ intense = false }: Props) {
  const chromaOffset = useMemo(
    () => new Vector2(intense ? 0.0025 : 0.0012, intense ? 0.0015 : 0.0006),
    [intense],
  )

  return (
    <EffectComposer multisampling={0}>
      <Glitch
        delay={new Vector2(intense ? 1.2 : 2.5, intense ? 3.0 : 6.0)}
        duration={new Vector2(0.08, 0.18)}
        strength={new Vector2(intense ? 0.35 : 0.18, intense ? 0.7 : 0.45)}
        mode={GlitchMode.SPORADIC}
        active
        ratio={0.85}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.35} opacity={0.12} />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
      <Vignette eskil={false} offset={0.15} darkness={0.85} />
    </EffectComposer>
  )
}
