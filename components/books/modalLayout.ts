// Desktop detail-modal geometry, shared by BookInfoPanel (CSS) and Book (3D landing spot)
export const MODAL_PADDING = 40
export const MODAL_GAP = 40
export const TEXT_WIDTH = 432
export const COVER_MAX_WIDTH = 380

export const COVER_WIDTH_CSS = `min(${COVER_MAX_WIDTH}px, calc((90vh - ${MODAL_PADDING * 2}px) / 1.5))`

export function getDesktopModalLayout(vw: number, vh: number) {
  const coverWidth = Math.min(COVER_MAX_WIDTH, (vh * 0.9 - MODAL_PADDING * 2) / 1.5)
  const modalWidth = Math.min(vw * 0.92, MODAL_PADDING * 2 + coverWidth + MODAL_GAP + TEXT_WIDTH)
  const coverCx = (vw - modalWidth) / 2 + MODAL_PADDING + coverWidth / 2
  return { coverWidth, coverHeight: coverWidth * 1.5, coverCx }
}
