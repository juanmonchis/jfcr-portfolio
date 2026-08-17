"use client"

import { useMemo } from "react"
import { BookData } from "./types"
import Book from "./Book"

interface BookshelfArrangementProps {
  books: BookData[]
  selectedBookId: number | null
  onSelectBook: (book: BookData) => void
  reducedMotion: boolean
}

export default function BookshelfArrangement({
  books,
  selectedBookId,
  onSelectBook,
  reducedMotion,
}: BookshelfArrangementProps) {
  const arcSpread = 1.2
  const radius = 1.8
  const baseY = 0
  const anySelected = selectedBookId !== null

  const positions = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    return books.map((book, i) => {
      const angle = books.length === 1 ? 0 : ((i / (books.length - 1)) - 0.5) * arcSpread
      const yOffset = (seededRandom(book.id * 7) - 0.5) * 0.15
      const zOffset = (seededRandom(book.id * 13) - 0.5) * 0.1
      return {
        position: [
          Math.sin(angle) * radius,
          baseY + yOffset,
          -Math.cos(angle) * radius * 0.3 + zOffset,
        ] as [number, number, number],
        rotation: [0.26, -angle * 0.5, 0] as [number, number, number],
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
          phaseOffset={i * 1.3}
          onSelect={() => onSelectBook(book)}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  )
}
