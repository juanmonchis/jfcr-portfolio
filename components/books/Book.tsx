"use client"

import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useSpring } from "@react-spring/three"
import * as THREE from "three"
import { BookData } from "./types"
import { useSpineTexture } from "./useSpineTexture"
import { RETURN_CONFIG, IMMEDIATE_CONFIG } from "./useBookSpring"
import type { ThreeEvent } from "@react-three/fiber"

const W = 0.22
const H = 0.32
const D = 0.05

// World-space position the selected book eases into (left-center, brought forward)
const SELECTED_POS: [number, number, number] = [-0.28, -0.1, 0.4]
const SELECTED_ROT: [number, number, number] = [0, 0, 0]
const SELECTED_SCALE = 3.0

const EASE_CONFIG = { mass: 2.5, tension: 70, friction: 22 }
const DESELECT_CONFIG = { mass: 1.5, tension: 100, friction: 20 }

interface BookProps {
  book: BookData
  restPosition: [number, number, number]
  restRotation: [number, number, number]
  isSelected: boolean
  anySelected: boolean
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
  phaseOffset,
  onSelect,
  reducedMotion,
}: BookProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const idleTimeRef = useRef(phaseOffset)

  const spineTexture = useSpineTexture(book.title, book.spineColor)

  const coverTexture = useTexture(book.coverUrl, (tex) => {
    if (Array.isArray(tex)) return
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
  })

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8", roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: "#F5F0E8", roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: book.spineColor, roughness: 0.7 }),
  ], [spineTexture, coverTexture, book.spineColor])

  const [spring, api] = useSpring(() => ({
    pos: restPosition,
    rot: restRotation,
    scale: 1,
    opacity: 1,
    config: reducedMotion ? IMMEDIATE_CONFIG : RETURN_CONFIG,
  }))

  useEffect(() => {
    if (isSelected) {
      api.start({
        pos: SELECTED_POS,
        rot: SELECTED_ROT,
        scale: SELECTED_SCALE,
        opacity: 1,
        config: reducedMotion ? IMMEDIATE_CONFIG : EASE_CONFIG,
      })
    } else if (anySelected) {
      // Shrink and dim non-selected books
      api.start({
        pos: restPosition,
        rot: restRotation,
        scale: 0.6,
        opacity: 0.25,
        config: reducedMotion ? IMMEDIATE_CONFIG : DESELECT_CONFIG,
      })
    } else {
      // Full reset when nothing selected
      api.start({
        pos: restPosition,
        rot: restRotation,
        scale: 1,
        opacity: 1,
        config: reducedMotion ? IMMEDIATE_CONFIG : DESELECT_CONFIG,
      })
    }
  }, [isSelected, anySelected, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const [px, py, pz] = spring.pos.get()
    const [rx, ry, rz] = spring.rot.get()
    const sc = spring.scale.get()
    const op = spring.opacity.get()

    meshRef.current.position.set(px, py, pz)
    meshRef.current.rotation.set(rx, ry, rz)
    meshRef.current.scale.setScalar(sc)

    // Apply opacity to all materials
    materials.forEach((mat) => {
      mat.transparent = op < 0.99
      mat.opacity = op
    })

    // Idle float — only when not selected and nothing is selected
    if (!isSelected && !anySelected && !reducedMotion) {
      idleTimeRef.current += delta
      const t = idleTimeRef.current
      meshRef.current.position.y += Math.sin(t * 0.8) * 0.0005
      meshRef.current.rotation.y += Math.sin(t * 0.4) * 0.0003
    }
  })

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect() }}
      onPointerOver={() => { if (!isSelected) document.body.style.cursor = "pointer" }}
      onPointerOut={() => { document.body.style.cursor = "auto" }}
      castShadow
    >
      <boxGeometry args={[W, H, D]} />
    </mesh>
  )
}
