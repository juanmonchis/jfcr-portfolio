"use client"

import { MutableRefObject, useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useSpring } from "@react-spring/three"
import * as THREE from "three"
import { BookData } from "./types"
import { useSpineTexture } from "./useSpineTexture"
import { RETURN_CONFIG, IMMEDIATE_CONFIG } from "./useBookSpring"

const W = 0.22
const H = 0.32
const D = 0.05

const HOVER_CONFIG = { tension: 200, friction: 18 }
const HIDE_CONFIG  = { tension: 300, friction: 28 }

interface BookProps {
  book: BookData
  restPosition: [number, number, number]
  restRotation: [number, number, number]
  isSelected: boolean
  anySelected: boolean
  isHovered: boolean
  mouseNDCRef: MutableRefObject<{ x: number; y: number }>
  phaseOffset: number
  onSelect: () => void
  reducedMotion: boolean
}

export default function BookMesh({
  book,
  restPosition,
  restRotation,
  isSelected,
  anySelected,
  isHovered,
  mouseNDCRef,
  phaseOffset,
  reducedMotion,
}: BookProps) {
  const meshRef        = useRef<THREE.Mesh>(null)
  const spinTimeRef    = useRef(phaseOffset)
  const hoverLerpPos   = useRef<[number, number]>([0, 0])
  const needsHoverInit = useRef(false)

  const spineTexture = useSpineTexture(book.title, book.spineColor)

  const coverTexture = useTexture(book.coverUrl, (tex) => {
    if (Array.isArray(tex)) return
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
  })

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: spineTexture,      roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",       roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",       roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ map: coverTexture,      roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7 }),
  ], [spineTexture, coverTexture, book.spineColor])

  const [spring, api] = useSpring(() => ({
    pos:     restPosition,
    rot:     restRotation,
    scale:   0,
    opacity: 0,
    config:  reducedMotion ? IMMEDIATE_CONFIG : RETURN_CONFIG,
  }))

  useEffect(() => {
    if (isHovered && !isSelected) {
      needsHoverInit.current = true
      spinTimeRef.current    = 0
      api.start({
        scale:   1.08,
        opacity: 1,
        config:  reducedMotion ? IMMEDIATE_CONFIG : HOVER_CONFIG,
      })
    } else {
      // Selected and non-selected both hide — the CSS modal handles the detail view
      api.start({
        pos:     restPosition,
        rot:     restRotation,
        scale:   0,
        opacity: 0,
        config:  reducedMotion ? IMMEDIATE_CONFIG : HIDE_CONFIG,
      })
    }
  }, [isSelected, isHovered, anySelected, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const { camera } = state

    const sc = spring.scale.get()
    const op = spring.opacity.get()

    meshRef.current.scale.setScalar(sc)
    materials.forEach((mat) => {
      mat.transparent = op < 0.99
      mat.opacity     = op
    })

    if (isHovered && !isSelected) {
      // Unproject mouse NDC to world position at z=0.35
      const ndc = mouseNDCRef.current
      const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5)
      vec.unproject(camera)
      const dir    = vec.sub(camera.position).normalize()
      const tParam = (0.35 - camera.position.z) / dir.z
      const tx     = camera.position.x + tParam * dir.x
      const ty     = camera.position.y + tParam * dir.y

      if (needsHoverInit.current) {
        hoverLerpPos.current[0] = tx
        hoverLerpPos.current[1] = ty
        needsHoverInit.current  = false
      } else {
        hoverLerpPos.current[0] += (tx - hoverLerpPos.current[0]) * 0.1
        hoverLerpPos.current[1] += (ty - hoverLerpPos.current[1]) * 0.1
      }

      meshRef.current.position.set(hoverLerpPos.current[0], hoverLerpPos.current[1], 0.35)

      // Aim toward mouse: Y and X rotation track absolute NDC position
      const aimY = -ndc.x * 0.35
      const aimX =  ndc.y * 0.25

      // Continuous Z spin
      if (!reducedMotion) spinTimeRef.current += delta
      const spinZ = spinTimeRef.current * 1.0

      meshRef.current.rotation.set(aimX, aimY, spinZ)
    } else {
      const [px, py, pz] = spring.pos.get()
      const [rx, ry, rz] = spring.rot.get()
      meshRef.current.position.set(px, py, pz)
      meshRef.current.rotation.set(rx, ry, rz)
    }
  })

  return (
    <mesh ref={meshRef} material={materials} castShadow>
      <boxGeometry args={[W, H, D]} />
    </mesh>
  )
}
