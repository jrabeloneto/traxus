import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE } from '../../utils/timing'

/**
 * Particles traversing cubic-bezier curves to progressively construct
 * the silhouette of a geometric industrial object.
 *
 * Inspired by @jesusemans p5.js peony (Instagram DXDn6KBDjmv), rebuilt
 * as native three.js Points so it sits inside the postprocessing pipeline.
 */

const POINTS_PER_CURVE = 80

function buildTargetCurves(): THREE.CubicBezierCurve3[] {
  const curves: THREE.CubicBezierCurve3[] = []
  const segments = 12
  const r = 2.0
  const cp = 1.4

  for (let i = 0; i < segments; i++) {
    const angle = (Math.PI * 2 / segments) * i
    const nextAngle = (Math.PI * 2 / segments) * (i + 1)

    // outer petal-like curve
    curves.push(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0),
        new THREE.Vector3(
          Math.cos(angle) * r * cp,
          Math.sin(angle + 0.3) * r * cp,
          Math.random() * 0.5,
        ),
        new THREE.Vector3(
          Math.cos(nextAngle) * r * cp,
          Math.sin(nextAngle - 0.3) * r * cp,
          Math.random() * 0.5,
        ),
        new THREE.Vector3(Math.cos(nextAngle) * r, Math.sin(nextAngle) * r, 0),
      ),
    )

    // inner structural curve (core → rim)
    const innerR = r * 0.4
    curves.push(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * innerR, Math.sin(angle) * innerR, 0.3),
        new THREE.Vector3(Math.cos(angle) * r * 0.7, Math.sin(angle) * r * 0.7, 0.1),
        new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0),
      ),
    )
  }
  return curves
}

interface Props {
  onProgress?: (p: number) => void
}

export function ParticleConstruct({ onProgress }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const progressRef = useRef(0)
  const holdUntilRef = useRef(0)

  const curves = useMemo(() => buildTargetCurves(), [])
  const totalPoints = curves.length * POINTS_PER_CURVE

  // Pre-compute all target positions
  const targetPositions = useMemo(() => {
    const pos = new Float32Array(totalPoints * 3)
    curves.forEach((curve, ci) => {
      const pts = curve.getPoints(POINTS_PER_CURVE - 1) // getPoints(n) returns n+1
      pts.forEach((p, pi) => {
        const idx = (ci * POINTS_PER_CURVE + pi) * 3
        pos[idx] = p.x
        pos[idx + 1] = p.y
        pos[idx + 2] = p.z
      })
    })
    return pos
  }, [curves, totalPoints])

  // Geometry with live positions + per-vertex colors (80/20 amber/cyan)
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(totalPoints * 3)
    const colors = new Float32Array(totalPoints * 3)

    const amber = new THREE.Color('#FF6500')
    const cyan = new THREE.Color('#00D4FF')

    for (let i = 0; i < totalPoints; i++) {
      const c = Math.random() > 0.8 ? cyan : amber
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [totalPoints])

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const now = state.clock.elapsedTime
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute

    // Hold when complete, then reset
    if (progressRef.current >= 1.0) {
      if (holdUntilRef.current === 0) {
        holdUntilRef.current = now + PARTICLE.holdDuration
      } else if (now >= holdUntilRef.current) {
        progressRef.current = 0
        holdUntilRef.current = 0
      }
    } else {
      progressRef.current = Math.min(
        progressRef.current + delta / PARTICLE.buildDuration,
        1.0,
      )
    }

    onProgress?.(progressRef.current)
    const p = progressRef.current
    const isGlitch = Math.random() < PARTICLE.glitchChance
    const visibleCount = Math.floor(p * totalPoints)

    for (let i = 0; i < totalPoints; i++) {
      if (i < visibleCount) {
        if (isGlitch && Math.random() > 0.7) {
          pos.setXYZ(
            i,
            targetPositions[i * 3] + (Math.random() - 0.5) * 3,
            targetPositions[i * 3 + 1] + (Math.random() - 0.5) * 3,
            targetPositions[i * 3 + 2] + (Math.random() - 0.5) * 1,
          )
        } else {
          pos.setXYZ(
            i,
            targetPositions[i * 3],
            targetPositions[i * 3 + 1],
            targetPositions[i * 3 + 2],
          )
        }
      } else {
        // hide at origin
        pos.setXYZ(i, 0, 0, 0)
      }
    }
    pos.needsUpdate = true

    // Idle rotation
    pts.rotation.y += delta * 0.15
    pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
