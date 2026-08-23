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
  cardCenterNDCRef: MutableRefObject<{ x: number; y: number }>
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
  cardCenterNDCRef,
  phaseOffset,
  reducedMotion,
}: BookProps) {
  const meshRef        = useRef<THREE.Mesh>(null)
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
    new THREE.MeshStandardMaterial({ map: spineTexture,      roughness: 0.7, transparent: false, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7, transparent: false, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",       roughness: 0.9, transparent: false, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",       roughness: 0.9, transparent: false, opacity: 1 }),
    new THREE.MeshStandardMaterial({ map: coverTexture,      roughness: 0.6, transparent: false, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7, transparent: false, opacity: 1 }),
  ], [spineTexture, coverTexture, book.spineColor])

  const [spring, api] = useSpring(() => ({
    pos:    restPosition,
    rot:    restRotation,
    scale:  0,
    config: reducedMotion ? IMMEDIATE_CONFIG : RETURN_CONFIG,
  }))

  useEffect(() => {
    if (isHovered && !isSelected) {
      needsHoverInit.current = true
      api.start({
        scale:  1.08,
        config: reducedMotion ? IMMEDIATE_CONFIG : HOVER_CONFIG,
      })
    } else if (isSelected) {
      // Compute modal cover target in world space
      const vw = window.innerWidth
      const vh = window.innerHeight
      const WORLD_HEIGHT = 2 * Math.tan((62 / 2) * (Math.PI / 180)) * 1.4
      const WORLD_WIDTH  = WORLD_HEIGHT * (vw / vh)
      const modalWidth   = Math.min(vw * 0.9, 728)
      const coverWidth   = 260
      const coverHeight  = coverWidth * 1.5
      const coverCx      = (vw - modalWidth) / 2 + 28 + coverWidth / 2
      const coverCy      = vh / 2
      const ndcX         = (coverCx / vw) * 2 - 1
      const ndcY         = -(coverCy / vh) * 2 + 1
      const worldX       = ndcX * WORLD_WIDTH  / 2
      const worldY       = ndcY * WORLD_HEIGHT / 2
      const targetScale  = (coverHeight / vh) * WORLD_HEIGHT / H

      api.start({
        pos:    [worldX, worldY, 0.1] as [number, number, number],
        rot:    [0, 0, 0]             as [number, number, number],
        scale:  targetScale,
        config: { tension: 200, friction: 28 },
      })
    } else {
      api.start({
        pos:    restPosition,
        rot:    restRotation,
        scale:  0,
        config: reducedMotion ? IMMEDIATE_CONFIG : HIDE_CONFIG,
      })
    }
  }, [isSelected, isHovered, anySelected, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const { camera } = state

    meshRef.current.scale.setScalar(spring.scale.get())

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

      // Tilt relative to hovered card's center — neutral at card center, pronounced at edges
      const center = cardCenterNDCRef.current
      const aimY =  (ndc.x - center.x) * (Math.PI * 0.9) // left/right
      const aimX = -(ndc.y - center.y) * (Math.PI * 0.6) // up/down

      meshRef.current.rotation.set(aimX, aimY, 0)

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
