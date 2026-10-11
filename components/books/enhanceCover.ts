import * as THREE from "three"

// Tuned for the 3D cards only; the 2D cover in the modal stays untouched.
export const COVER_CONTRAST   = 1.14
export const COVER_SATURATION = 1.12

/** Re-draws a cover image with a contrast + saturation boost, done per pixel so it works in every browser. */
export function createEnhancedCoverTexture(source: THREE.Texture): THREE.Texture {
  const img = source.image as HTMLImageElement | undefined
  if (!img || !img.width || !img.height) return source

  const scale  = Math.min(1, 1600 / Math.max(img.width, img.height))
  const canvas = document.createElement("canvas")
  canvas.width  = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext("2d")
  if (!ctx) return source

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const px   = data.data

  for (let i = 0; i < px.length; i += 4) {
    const gray = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
    for (let c = 0; c < 3; c++) {
      const saturated = gray + (px[i + c] - gray) * COVER_SATURATION
      px[i + c] = (saturated - 128) * COVER_CONTRAST + 128 // Uint8ClampedArray clamps to 0–255
    }
  }
  ctx.putImageData(data, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}
