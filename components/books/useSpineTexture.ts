import { useMemo } from "react"
import * as THREE from "three"

export function useSpineTexture(title: string, color: string): THREE.CanvasTexture {
  return useMemo(() => {
    const W = 64
    const H = 256
    const canvas = document.createElement("canvas")
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext("2d")!

    ctx.fillStyle = color
    ctx.fillRect(0, 0, W, H)

    ctx.save()
    ctx.translate(W / 2, H / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.font = "bold 13px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const maxWidth = H - 24
    ctx.fillText(title.toUpperCase(), 0, 0, maxWidth)
    ctx.restore()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [title, color])
}
