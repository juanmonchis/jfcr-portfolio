"use client"

import { MutableRefObject, useMemo } from "react"
import { BookData } from "./types"
import Book from "./Book"

interface BookshelfArrangementProps {
  books: BookData[]
  selectedBookId: number | null
  hoveredBookId: number | null
  mouseNDCRef: MutableRefObject<{ x: number; y: number }>
  onSelectBook: (book: BookData) => void
  reducedMotion: boolean
}

export default function BookshelfArrangement({
  books,
  selectedBookId,
  hoveredBookId,
  mouseNDCRef,
  onSelectBook,
  reducedMotion,
}: BookshelfArrangementProps) {
  const anySelected = selectedBookId !== null

  const positions = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    const colSpacing = 0.55
    const rowY       = [0.15, -0.40]
    const rowCols    = [3, 2]

    return books.map((book, i) => {
      const row      = i < 3 ? 0 : 1
      const col      = i < 3 ? i : i - 3
      const colCount = rowCols[row]
      const xCenter  = (col - (colCount - 1) / 2) * colSpacing
      const y        = rowY[row] + (seededRandom(book.id * 7) - 0.5) * 0.04
      const z        = (seededRandom(book.id * 13) - 0.5) * 0.05

      return {
        position: [xCenter, y, z] as [number, number, number],
        rotation: [0.18, 0, 0]   as [number, number, number],
      }
    })
  }, [books])

  return (
    <>
      {books.map((book, i) => (
        <Book
          key={book.id}
          book={book}
          restPosition={positions[i].position}
          restRotation={positions[i].rotation}
          isSelected={selectedBookId === book.id}
          anySelected={anySelected}
          isHovered={hoveredBookId === book.id}
          mouseNDCRef={mouseNDCRef}
          phaseOffset={i * 1.3}
          onSelect={() => onSelectBook(book)}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  )
}
