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

const SELECTED_POS: [number, number, number] = [-0.28, -0.1, 0.4]
const SELECTED_ROT: [number, number, number] = [0, 0, 0]
const SELECTED_SCALE = 3.0

const EASE_CONFIG    = { mass: 2.5, tension: 70,  friction: 22 }
const DESELECT_CONFIG = { mass: 1.5, tension: 100, friction: 20 }
const HOVER_CONFIG   = { tension: 200, friction: 18 }
const HIDE_CONFIG    = { tension: 300, friction: 28 }

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
  const idleTimeRef    = useRef(phaseOffset)
  const hoverLerpPos   = useRef<[number, number]>([0, 0])
  const needsHoverInit = useRef(false)
  const lastWorldPos   = useRef<[number, number, number]>([restPosition[0], restPosition[1], restPosition[2]])

  const spineTexture = useSpineTexture(book.title, book.spineColor)

  const coverTexture = useTexture(book.coverUrl, (tex) => {
    if (Array.isArray(tex)) return
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
  })

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: spineTexture,          roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor,     roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",           roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8",           roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ map: coverTexture,          roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor,     roughness: 0.7 }),
  ], [spineTexture, coverTexture, book.spineColor])

  // Start invisible — books only appear on hover or selection
  const [spring, api] = useSpring(() => ({
    pos:     restPosition,
    rot:     restRotation,
    scale:   0,
    opacity: 0,
    config:  reducedMotion ? IMMEDIATE_CONFIG : RETURN_CONFIG,
  }))

  useEffect(() => {
    if (isSelected) {
      // Snap spring position to wherever the book is currently floating, then animate to selected
      api.set({ pos: [lastWorldPos.current[0], lastWorldPos.current[1], lastWorldPos.current[2]] })
      api.start({
        pos:     SELECTED_POS,
        rot:     SELECTED_ROT,
        scale:   SELECTED_SCALE,
        opacity: 1,
        config:  reducedMotion ? IMMEDIATE_CONFIG : EASE_CONFIG,
      })
    } else if (isHovered) {
      needsHoverInit.current = true
      // Position is driven by useFrame mouse follow; spring only handles scale/rot/opacity
      api.start({
        rot:     [0.05, 0.1, 0],
        scale:   1.8,
        opacity: 1,
        config:  reducedMotion ? IMMEDIATE_CONFIG : HOVER_CONFIG,
      })
    } else if (anySelected) {
      api.start({
        pos:     restPosition,
        rot:     restRotation,
        scale:   0,
        opacity: 0,
        config:  reducedMotion ? IMMEDIATE_CONFIG : DESELECT_CONFIG,
      })
    } else {
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

    const [rx, ry, rz] = spring.rot.get()
    const sc            = spring.scale.get()
    const op            = spring.opacity.get()

    meshRef.current.rotation.set(rx, ry, rz)
    meshRef.current.scale.setScalar(sc)

    materials.forEach((mat) => {
      mat.transparent = op < 0.99
      mat.opacity     = op
    })

    if (isHovered && !isSelected) {
      // Unproject mouse NDC to world position at a fixed z depth in front of the scene
      const ndc = mouseNDCRef.current
      const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5)
      vec.unproject(camera)
      const dir    = vec.sub(camera.position).normalize()
      const tParam = (0.35 - camera.position.z) / dir.z
      const tx     = camera.position.x + tParam * dir.x
      const ty     = camera.position.y + tParam * dir.y

      if (needsHoverInit.current) {
        // First hover frame: snap to mouse (no visible lerp since scale is still 0)
        hoverLerpPos.current[0] = tx
        hoverLerpPos.current[1] = ty
        needsHoverInit.current  = false
      } else {
        hoverLerpPos.current[0] += (tx - hoverLerpPos.current[0]) * 0.1
        hoverLerpPos.current[1] += (ty - hoverLerpPos.current[1]) * 0.1
      }

      meshRef.current.position.set(hoverLerpPos.current[0], hoverLerpPos.current[1], 0.35)
      lastWorldPos.current = [hoverLerpPos.current[0], hoverLerpPos.current[1], 0.35]
    } else {
      const [px, py, pz] = spring.pos.get()
      meshRef.current.position.set(px, py, pz)
      lastWorldPos.current = [px, py, pz]

      // Gentle idle bob while selected
      if (isSelected && !reducedMotion) {
        idleTimeRef.current += delta
        const t = idleTimeRef.current
        meshRef.current.position.y += Math.sin(t * 0.6) * 0.0008
        meshRef.current.rotation.y += Math.sin(t * 0.3) * 0.0004
      }
    }
  })

  return (
    <mesh ref={meshRef} material={materials} castShadow>
      <boxGeometry args={[W, H, D]} />
    </mesh>
  )
}
